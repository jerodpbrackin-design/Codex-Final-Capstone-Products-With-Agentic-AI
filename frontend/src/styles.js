export const tokens = {
  primary: '#2563eb',
  muted: '#e6e9ef',
  bg: '#fbfdff',
  radius: 10,
};

export default {
  tokens,

  card: {
    background: 'white',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    marginBottom: 16,
  },

  title: {
    marginBottom: 12,
  },

  form: {
    display: 'flex',
    gap: 10,
    flexDirection: 'column',
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ddd',
  },

  button: {
    padding: 10,
    borderRadius: 8,
    border: 'none',
    background: tokens.primary,
    color: 'white',
    cursor: 'pointer',
  },

  smallBtn: {
    padding: '6px 10px',
    borderRadius: 6,
    border: 'none',
    background: tokens.primary,
    color: 'white',
    cursor: 'pointer',
    fontSize: 12,
  },

  grayBtn: {
    padding: 10,
    borderRadius: 8,
    border: 'none',
    background: '#e5e7eb',
    cursor: 'pointer',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    background: 'white',
    padding: 20,
    borderRadius: 12,
    width: 300,
  },

  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #eef2f7, #f8fafc)',
    fontFamily: 'Inter, Arial, sans-serif',
    padding: 24,
  },

  chatCard: {
    width: 480,
    height: 640,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 14,
    background: '#ffffff',
    boxShadow: '0 12px 30px rgba(2,6,23,0.08)',
    overflow: 'hidden',
  },

  header: {
    padding: 16,
    fontWeight: 600,
    borderBottom: '1px solid #eef2f6',
    background: '#fff',
  },

  chatWindow: {
    flex: 1,
    padding: 20,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: tokens.bg,
  },

  emptyState: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },

  messageRow: {
    display: 'flex',
  },

  bubble: {
    padding: '10px 14px',
    borderRadius: 16,
    maxWidth: '75%',
    fontSize: 14,
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    boxShadow: '0 4px 10px rgba(2,6,23,0.04)',
  },

  inputBar: {
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #eef2f6',
    background: '#ffffff',
    alignItems: 'center',
  },

  chatInput: {
    flex: 1,
    padding: '10px 12px',
    height: 44,
    borderRadius: tokens.radius,
    border: `1px solid ${tokens.muted}`,
    outline: 'none',
    fontSize: 14,
  },

  chatButton: {
    marginLeft: 8,
    height: 44,
    padding: '0 16px',
    borderRadius: tokens.radius,
    border: 'none',
    background: tokens.primary,
    color: '#fff',
    cursor: 'pointer',
  },
};
