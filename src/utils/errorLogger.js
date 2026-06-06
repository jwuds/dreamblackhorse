export const LogSeverity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL'
};

const formatLog = (severity, message, context, error) => {
  return {
    timestamp: new Date().toISOString(),
    severity,
    message,
    context: context || {},
    error: error ? { 
      message: error.message, 
      stack: error.stack, 
      code: error.code,
      hint: error.hint,
      details: error.details 
    } : null
  };
};

export const logInfo = (message, context) => {
  const log = formatLog(LogSeverity.INFO, message, context);
  console.info('[INFO]', log);
};

export const logWarning = (message, context, error) => {
  const log = formatLog(LogSeverity.WARNING, message, context, error);
  console.warn('[WARNING]', log);
};

export const logError = (message, context, error) => {
  const log = formatLog(LogSeverity.ERROR, message, context, error);
  console.error('[ERROR]', log);
};

export const logCritical = (message, context, error) => {
  const log = formatLog(LogSeverity.CRITICAL, message, context, error);
  console.error('[CRITICAL]', log);
};

export const logSupabaseError = (contextMessage, error, context) => {
  const isRLSViolation = error?.code === '42501' || error?.message?.includes('policy');
  const severity = isRLSViolation ? LogSeverity.WARNING : LogSeverity.ERROR;
  
  const enhancedContext = {
    ...context,
    errorCode: error?.code,
    errorHint: error?.hint,
    errorDetails: error?.details,
    isRLSViolation,
    operation: context?.operation || 'UNKNOWN',
    table: context?.table || 'UNKNOWN'
  };

  const log = formatLog(
    severity,
    `${contextMessage} - ${isRLSViolation ? 'RLS Policy Violation' : 'Supabase Query Error'}`,
    enhancedContext,
    error
  );

  if (isRLSViolation) {
    console.warn('[SUPABASE RLS VIOLATION]', log);
  } else {
    console.error('[SUPABASE ERROR]', log);
  }

  return log;
};

export const logQuery = (operation, table, filters, result, executionTimeMs = 0) => {
  const log = formatLog(LogSeverity.INFO, `Query Execution: ${operation} on ${table}`, {
    operation,
    table,
    filters,
    success: result !== null && result !== undefined,
    executionTimeMs
  });
  console.debug('[QUERY]', log);
};

export const logValidationError = (field, value, expectedType) => {
  const log = formatLog(LogSeverity.WARNING, `Validation Error on ${field}`, {
    field,
    value: typeof value === 'object' ? JSON.stringify(value) : value,
    expectedType
  });
  console.warn('[VALIDATION]', log);
};

export const logRLSViolation = (table, operation, reason) => {
  const log = formatLog(LogSeverity.WARNING, `RLS Violation on ${table}`, {
    table,
    operation,
    reason
  });
  console.warn('[RLS VIOLATION]', log);
};

export const logAuthError = (message, error, context) => {
  const log = formatLog(LogSeverity.ERROR, `Auth Error: ${message}`, {
    ...context,
    suggestion: "Clear browser storage and re-authenticate if the issue persists."
  }, error);
  console.error('[AUTH ERROR]', log);
  return log;
};

export const logRefreshTokenError = (error, context) => {
  const log = formatLog(LogSeverity.ERROR, "Refresh Token Error", {
    ...context,
    suggestion: "Session expired or token invalid. Require manual re-authentication."
  }, error);
  console.error('[REFRESH TOKEN ERROR]', log);
  return log;
};

export const logSessionError = (error, context) => {
  const log = formatLog(LogSeverity.WARNING, "Session Error / Missing Session", {
    ...context,
    suggestion: "User might need to log in."
  }, error);
  console.warn('[SESSION ERROR]', log);
  return log;
};