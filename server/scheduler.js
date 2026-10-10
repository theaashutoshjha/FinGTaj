import { db } from './db.js';
import { researchEngine } from './researchEngine.js';
import { articleGenerator } from './articleGenerator.js';

class PipelineScheduler {
  constructor() {
    this.timer = null;
    this.isRunning = false;
  }

  // Execute full automated pipeline
  async runPipelineJob({ topicId = null, triggeredBy = 'system' } = {}) {
    const settings = db.getSettings();

    // 1. Check Kill Switch
    if (settings.killSwitch) {
      console.warn('[Scheduler] EMERGENCY KILL SWITCH is ACTIVE. Pipeline aborted.');
      return { success: false, reason: 'KILL_SWITCH_ACTIVE' };
    }

    // 2. Create Job Record
    const job = db.addJob({
      type: 'full_pipeline',
      triggeredBy,
      step: 'DISCOVER',
      logs: ['Job started. Idempotency protection active.']
    });

    try {
      // Step A: Topic Discovery / Selection
      let selectedTopic = null;
      if (topicId) {
        selectedTopic = db.getTopics().find(t => t.id === topicId);
      }
      
      if (!selectedTopic) {
        this.logStep(job.id, 'DISCOVER', 'Discovering topics from authority feeds...');
        const discovered = await researchEngine.discoverTopics();
        selectedTopic = discovered[0] || db.getTopics().find(t => t.status === 'discovered');
      }

      if (!selectedTopic) {
        this.logStep(job.id, 'ABORTED', 'No eligible topics found for research.');
        db.updateJob(job.id, { status: 'failed', error: 'No topics available' });
        return { success: false, reason: 'NO_TOPICS' };
      }

      this.logStep(job.id, 'RESEARCH', `Researching topic: "${selectedTopic.title}"`);
      if (db.getSettings().killSwitch) throw new Error('KILL_SWITCH_TRIGGERED');

      // Step B: Research & Build Brief
      const brief = await researchEngine.conductResearch(selectedTopic.id);
      this.logStep(job.id, 'BRIEF_CREATED', 'Research brief constructed with verified citations.');

      // Step C: Generate Article
      this.logStep(job.id, 'GENERATE', 'Generating comprehensive institutional article...');
      if (db.getSettings().killSwitch) throw new Error('KILL_SWITCH_TRIGGERED');

      const draft = await articleGenerator.generateArticleFromBrief(brief);
      this.logStep(job.id, 'DRAFT_SAVED', `Draft saved (ID: ${draft.id}) with live SEO/AEO audits.`);

      // Step D: Quality Gate Evaluation
      const originalityPassed = draft.originalityScore >= 80;
      const factsPassed = draft.factVerificationPassed;
      const seoPassed = draft.seo.score >= 90;
      const aeoPassed = draft.aeo.score >= 88;

      this.logStep(
        job.id, 
        'AUDITED', 
        `Audit Scores: Originality=${draft.originalityScore}%, SEO=${draft.seo.score}/100, AEO=${draft.aeo.score}/100, Facts=${factsPassed ? 'PASSED' : 'FLAGGED'}`
      );

      // Step E: Auto-Publishing Gate (Disabled by default!)
      let published = false;
      if (settings.autoPublish && originalityPassed && factsPassed && seoPassed && aeoPassed) {
        this.logStep(job.id, 'PUBLISH', 'Auto-publish enabled and all quality gates cleared. Publishing live...');
        draft.status = 'published';
        draft.publishedAt = new Date().toISOString();
        db.saveArticle(draft);
        published = true;
        db.logAction('AUTO_PUBLISH_ARTICLE', 'scheduler', { articleId: draft.id, title: draft.title });
      } else {
        this.logStep(job.id, 'DRAFT_SAVED', 'Article retained in drafts for editorial review and approval.');
        db.logAction('CREATE_DRAFT_ARTICLE', triggeredBy, { articleId: draft.id, title: draft.title });
      }

      db.updateJob(job.id, {
        status: 'completed',
        articleId: draft.id,
        published
      });

      return { success: true, jobId: job.id, article: draft, published };
    } catch (err) {
      console.error(`[Scheduler] Pipeline job ${job.id} failed:`, err);
      this.logStep(job.id, 'ERROR', err.message);
      db.updateJob(job.id, { status: 'failed', error: err.message });
      return { success: false, jobId: job.id, error: err.message };
    }
  }

  logStep(jobId, step, message) {
    const job = db.getJobs().find(j => j.id === jobId);
    if (job) {
      const logs = job.logs || [];
      logs.push(`[${new Date().toISOString().slice(11, 19)}] [${step}] ${message}`);
      db.updateJob(jobId, { step, logs });
    }
  }

  // Start background interval runner (e.g. checks every 12 hours)
  start(intervalMs = 12 * 60 * 60 * 1000) {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[Scheduler] Background publisher initialized.');

    this.timer = setInterval(async () => {
      const settings = db.getSettings();
      if (!settings.killSwitch && settings.autoPublish) {
        console.log('[Scheduler] Running scheduled pipeline cycle...');
        await this.runPipelineJob({ triggeredBy: 'cron_scheduler' });
      }
    }, intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('[Scheduler] Background publisher stopped.');
  }
}

export const scheduler = new PipelineScheduler();
