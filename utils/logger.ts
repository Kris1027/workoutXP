/**
 * Centralized logging utility
 * In production, this should be replaced with a proper logging service like:
 * - Sentry
 * - LogRocket
 * - Datadog
 * - AWS CloudWatch
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isEnabled = process.env.NEXT_PUBLIC_ENABLE_LOGGING !== 'false';

  private log(level: LogLevel, message: string, context?: LogContext) {
    // In production, send to logging service instead of console
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    // Development: Use console
    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
          console.debug(`[${timestamp}] DEBUG:`, message, context || '');
          break;
        case 'info':
          console.info(`[${timestamp}] INFO:`, message, context || '');
          break;
        case 'warn':
          console.warn(`[${timestamp}] WARN:`, message, context || '');
          break;
        case 'error':
          console.error(`[${timestamp}] ERROR:`, message, context || '');
          break;
      }
      return;
    }

    // Production: Send to logging service
    // TODO: Replace with actual logging service integration
    // Example integrations:
    
    // Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureMessage(message, level);
    //   if (context) {
    //     window.Sentry.setContext('additional', context);
    //   }
    // }

    // Custom logging endpoint
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logData),
    // }).catch(() => {
    //   // Fail silently to not impact user experience
    // });

    // For now, in production we'll just suppress logs
    // to avoid exposing information in browser console
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  // Special method for auth-related logs
  authError(action: string, errorType: string, context?: LogContext) {
    // Exclude sensitive fields from context entirely
    const { 
      password, 
      token, 
      secret, 
      credentials,
      authorization,
      cookie,
      sessionToken,
      refreshToken,
      accessToken,
      apiKey,
      ...safeContext 
    } = context || {};
    
    this.error(`Auth ${action} failed`, {
      action,
      errorType,
      ...safeContext,
    });
  }
}

// Export singleton instance
export const logger = new Logger();