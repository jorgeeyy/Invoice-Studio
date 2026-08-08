import { useState, useEffect, useCallback } from 'react';

type Step = 'idle' | 'header' | 'client' | 'items' | 'totals' | 'save' | 'pause';

const STEPS: Step[] = ['header', 'client', 'items', 'totals', 'save', 'pause'];
const STEP_DURATIONS: Record<Step, number> = {
  idle: 0,
  header: 600,
  client: 1800,
  items: 2200,
  totals: 1200,
  save: 1400,
  pause: 2500,
};

const CLIENT_NAME = 'Alex Rivera';
const CLIENT_EMAIL = 'alex@example.com';
const CLIENT_ADDRESS = '456 Oak Ave, Brooklyn, NY 11201';
const ITEMS = [
  { name: 'Website Redesign', desc: 'Full responsive redesign of marketing site', qty: '1', rate: '2,400.00', amount: '2,400.00' },
  { name: 'Logo Design', desc: 'Brand identity package with 3 concepts', qty: '2', rate: '350.00', amount: '700.00' },
];

export function EditorAnimation() {
  const [step, setStep] = useState<Step>('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [typedClient, setTypedClient] = useState('');
  const [typedEmail, setTypedEmail] = useState('');
  const [typedAddress, setTypedAddress] = useState('');
  const [visibleItems, setVisibleItems] = useState(0);
  const [showTotals, setShowTotals] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [clientSelected, setClientSelected] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  const reset = useCallback(() => {
    setStep('idle');
    setStepIndex(0);
    setTypedClient('');
    setTypedEmail('');
    setTypedAddress('');
    setVisibleItems(0);
    setShowTotals(false);
    setShowSave(false);
    setClientSelected(false);
    setShowHeader(false);
  }, []);

  useEffect(() => {
    const currentStep = STEPS[stepIndex];
    if (!currentStep) {
      const timeout = setTimeout(reset, 100);
      return () => clearTimeout(timeout);
    }
    setStep(currentStep);
    const timeout = setTimeout(() => {
      if (currentStep === 'header') setShowHeader(true);
      if (currentStep === 'totals') setShowTotals(true);
      if (currentStep === 'save') setShowSave(true);
      setStepIndex((i) => i + 1);
    }, STEP_DURATIONS[currentStep]);
    return () => clearTimeout(timeout);
  }, [stepIndex, reset]);

  // Typing client name
  useEffect(() => {
    if (step !== 'client' || clientSelected) return;
    if (typedClient.length < CLIENT_NAME.length) {
      const t = setTimeout(() => setTypedClient(CLIENT_NAME.slice(0, typedClient.length + 1)), 50);
      return () => clearTimeout(t);
    }
    if (typedEmail.length < CLIENT_EMAIL.length) {
      const t = setTimeout(() => setTypedEmail(CLIENT_EMAIL.slice(0, typedEmail.length + 1)), 30);
      return () => clearTimeout(t);
    }
    if (typedAddress.length < CLIENT_ADDRESS.length) {
      const t = setTimeout(() => setTypedAddress(CLIENT_ADDRESS.slice(0, typedAddress.length + 1)), 25);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setClientSelected(true), 400);
    return () => clearTimeout(t);
  }, [step, typedClient, typedEmail, typedAddress, clientSelected]);

  // Items appearing
  useEffect(() => {
    if (step !== 'items') return;
    if (visibleItems >= ITEMS.length) return;
    const t = setTimeout(() => setVisibleItems((v) => v + 1), 700);
    return () => clearTimeout(t);
  }, [step, visibleItems]);

  return (
    <div className="relative">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulseSave {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.06); }
          50% { box-shadow: 0 0 0 8px rgba(0,0,0,0); }
        }
        @keyframes rowSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes highlightFlash {
          0% { background-color: rgba(34, 197, 94, 0.1); }
          100% { background-color: transparent; }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .anim-layout { animation: fadeSlideUp 0.5s ease-out both; }
        .anim-fade { animation: fadeIn 0.4s ease-out both; }
        .anim-row { animation: rowSlide 0.4s ease-out both; }
        .anim-cursor::after {
          content: '|';
          animation: blink 0.7s step-end infinite;
          color: var(--color-secondary);
          font-weight: 300;
          margin-left: 1px;
        }
        .anim-save { animation: pulseSave 1.2s ease-in-out infinite; }
        .anim-highlight { animation: highlightFlash 0.6s ease-out; }
        .anim-pulse { animation: subtlePulse 1s ease-in-out infinite; }
      `}</style>

      <div
        className={`bg-surface-container-lowest rounded-2xl border border-border-subtle overflow-hidden shadow-2xl shadow-black/8 transition-opacity duration-500 ${
          showHeader || step === 'idle' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top App Bar — matches real CreateInvoice header */}
        <div className="h-14 bg-surface-bright border-b border-border-subtle flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded bg-on-surface-variant/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-on-surface-variant/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-primary">New Invoice</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 border border-border-subtle rounded px-2.5 flex items-center text-[10px] text-on-surface-variant bg-surface-container-lowest">
              Minimal
              <svg className="w-3 h-3 ml-1 text-on-surface-variant/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="w-8 h-8 rounded flex items-center justify-center bg-on-surface-variant/8">
              <svg className="w-4 h-4 text-on-surface-variant/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div className="w-8 h-8 rounded flex items-center justify-center bg-on-surface-variant/8">
              <svg className="w-4 h-4 text-on-surface-variant/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Editor / Preview Grid */}
        <div className="flex flex-col lg:flex-row min-h-[520px]">
          {/* ═══════════ LEFT: Editor Panel ═══════════ */}
          <div className="w-full lg:w-[480px] bg-surface-container-lowest lg:border-r border-b lg:border-b-0 border-border-subtle p-4 sm:p-8 space-y-6 flex flex-col overflow-hidden">
            {/* Client Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Client</label>
              <div className="relative">
                <div
                  className={`w-full h-10 border rounded px-3 flex items-center text-sm appearance-none transition-all duration-300 ${
                    clientSelected
                      ? 'border-border-subtle bg-surface-container-lowest text-primary font-medium'
                      : step === 'client'
                      ? 'border-secondary bg-white shadow-sm shadow-secondary/10'
                      : 'border-border-subtle bg-surface-container-lowest text-on-surface-variant/40'
                  }`}
                >
                  {clientSelected ? (
                    <span>{CLIENT_NAME}</span>
                  ) : typedClient ? (
                    <span className="text-primary">{typedClient}<span className="anim-cursor" /></span>
                  ) : (
                    <span>Select a client...</span>
                  )}
                  <span className="absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[10px]">▼</span>
                </div>
              </div>
              {!clientSelected && (
                <button className="text-secondary text-xs font-semibold flex items-center gap-1 hover:underline">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Create new client
                </button>
              )}
              {clientSelected && (
                <div className="text-xs text-on-surface-variant space-y-0.5 anim-fade">
                  <div>{CLIENT_EMAIL}</div>
                  <div>{CLIENT_ADDRESS}</div>
                </div>
              )}
            </div>

            {/* Dates & Currency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Issue Date</label>
                <div className="w-full h-10 border border-border-subtle rounded px-3 flex items-center text-sm text-on-surface-variant bg-surface-container-lowest">
                  2026-08-08
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Currency</label>
                <div className="w-full h-10 border border-border-subtle rounded px-3 flex items-center text-sm text-on-surface-variant bg-surface-container-lowest">
                  USD — US Dollar
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Reference</label>
                <div className="w-full h-10 border border-border-subtle rounded px-3 flex items-center text-sm text-on-surface-variant/40 bg-surface-container-lowest">
                  PO #
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Items</label>
              </div>
              <div className="space-y-2">
                {ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className={`border border-border-subtle rounded relative transition-all duration-300 ${
                      i < visibleItems ? 'anim-row bg-surface-container-lowest p-4' : 'opacity-0 h-0 p-0 border-0 overflow-hidden'
                    }`}
                  >
                    {i < visibleItems && (
                      <>
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-12">
                            <div className="w-full h-9 border border-border-subtle rounded px-3 flex items-center text-sm font-semibold bg-surface-container-lowest">
                              {item.name}
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="w-full border border-border-subtle rounded px-3 py-2 text-sm text-on-surface-variant bg-surface-container-lowest min-h-[36px]">
                              {item.desc}
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label className="text-[10px] text-on-surface-variant block mb-1">Qty</label>
                            <div className="w-full h-9 border border-border-subtle rounded px-3 flex items-center text-sm bg-surface-container-lowest">
                              {item.qty}
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label className="text-[10px] text-on-surface-variant block mb-1">Price</label>
                            <div className="w-full h-9 border border-border-subtle rounded px-3 flex items-center text-sm bg-surface-container-lowest">
                              ${item.rate}
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label className="text-[10px] text-on-surface-variant block mb-1">Discount</label>
                            <div className="w-full h-9 border border-border-subtle rounded px-3 flex items-center text-sm text-on-surface-variant bg-surface-container-lowest">
                              0
                            </div>
                          </div>
                          <div className="col-span-3 flex items-end justify-end">
                            <span className="font-semibold text-sm mb-2">${item.amount}</span>
                          </div>
                        </div>
                        <button className="absolute -top-2 -right-2 w-6 h-6 bg-status-error text-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-10 border border-dashed border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add item
                </button>
                <button className="h-10 px-4 border border-dashed border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Products
                </button>
              </div>
            </div>

            {/* Discount, Tax & Terms */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Discount</label>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 border border-border-subtle rounded px-3 flex items-center text-sm bg-surface-container-lowest">0</div>
                    <div className="w-20 h-10 border border-border-subtle rounded px-2 flex items-center justify-center text-sm bg-surface-container-lowest">%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax Rate (%)</label>
                  <div className="w-full h-10 border border-border-subtle rounded px-3 flex items-center text-sm bg-surface-container-lowest">10</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax Name</label>
                <div className="w-full h-10 border border-border-subtle rounded px-3 flex items-center text-sm text-on-surface-variant bg-surface-container-lowest">VAT</div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Payment Terms</label>
                <div className="w-full h-10 border border-border-subtle rounded px-3 flex items-center text-sm text-on-surface-variant bg-surface-container-lowest appearance-none">
                  Due within 30 days
                  <span className="ml-auto text-[10px] text-on-surface-variant/60">▼</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Notes</label>
                <div className="w-full border border-border-subtle rounded px-3 py-3 text-sm text-on-surface-variant/40 bg-surface-container-lowest min-h-[72px]">
                  Visible to your client...
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Internal Notes</label>
                <div className="w-full border border-border-subtle rounded px-3 py-3 text-sm text-on-surface-variant/40 bg-surface-container-lowest min-h-[56px]">
                  Not visible on the invoice...
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-border-subtle pt-4">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">How should clients pay you?</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Bank Transfer', 'Mobile Money', 'Crypto', 'Custom', 'Custom 2'].map((method) => (
                  <div
                    key={method}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant border border-border-subtle"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Sticky Actions */}
            <div className="border-t border-border-subtle pt-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <div
                  className={`flex-1 h-11 border border-border-subtle rounded flex items-center justify-center text-sm font-semibold transition-all ${
                    showSave ? 'anim-highlight' : ''
                  }`}
                >
                  Save Draft
                </div>
                <div
                  className={`flex-1 h-11 bg-secondary text-white rounded flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                    showSave ? 'anim-save' : 'opacity-60'
                  }`}
                >
                  Send Invoice
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ RIGHT: Live Preview Panel ═══════════ */}
          <div className="flex-1 bg-surface-container-low p-4 sm:p-8 lg:p-12 flex justify-center overflow-hidden">
            <div className={`bg-surface-container-lowest w-full max-w-[800px] min-h-[842px] p-8 sm:p-12 flex flex-col shadow-sm rounded-xl border border-border-subtle transition-opacity duration-500 ${showHeader ? 'opacity-100' : 'opacity-0'}`}>
              {/* Company Header & Invoice Info */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-6">
                <div>
                  <div className="text-xl font-bold tracking-tight mb-3 uppercase text-primary">ACME Corp</div>
                  <div className="text-[10px] text-on-surface-variant space-y-0.5">
                    <div>123 Business Street</div>
                    <div>New York, NY 10001</div>
                    <div>billing@acmecorp.com</div>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5">Invoice No.</div>
                  <div className="text-base font-semibold text-primary mb-4">INV-0001</div>
                  <div className="flex gap-6 md:justify-end">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-on-surface-variant mb-0.5">Date Issued</div>
                      <div className="text-xs text-primary">Aug 8, 2026</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div className="mb-12 border-t border-border-subtle pt-6">
                <div className="text-[11px] uppercase tracking-wider text-on-surface-variant mb-3">Billed To</div>
                <div className={`text-base font-semibold text-primary mb-1 transition-all duration-300 ${
                  clientSelected ? 'anim-fade' : typedClient ? 'opacity-60' : 'opacity-30'
                }`}>
                  {clientSelected ? CLIENT_NAME : typedClient || 'Client Name'}
                </div>
                {clientSelected && (
                  <div className="text-[10px] text-on-surface-variant space-y-0.5 anim-fade">
                    <div>{CLIENT_EMAIL}</div>
                    <div>{CLIENT_ADDRESS}</div>
                  </div>
                )}
                {!clientSelected && typedClient && (
                  <div className="text-[10px] text-on-surface-variant/40 space-y-0.5">
                    <div>{typedEmail || 'email@example.com'}</div>
                  </div>
                )}
              </div>

              {/* Line Items Table */}
              <div className="mb-12 flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="py-3 text-[11px] uppercase tracking-wider text-on-surface-variant w-1/2">Description</th>
                      <th className="py-3 text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Qty / Hrs</th>
                      <th className="py-3 text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Rate</th>
                      <th className="py-3 text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {ITEMS.map((item, i) => (
                      <tr
                        key={i}
                        className={`border-b border-border-subtle/50 transition-all ${
                          i < visibleItems ? 'anim-fade' : 'opacity-0'
                        }`}
                      >
                        <td className="py-4 pr-4">
                          {i < visibleItems && (
                            <>
                              <div className="font-medium text-primary">{item.name}</div>
                              <div className="text-xs text-on-surface-variant mt-1">{item.desc}</div>
                            </>
                          )}
                        </td>
                        <td className="py-4 text-right align-top text-primary">{i < visibleItems ? item.qty : ''}</td>
                        <td className="py-4 text-right align-top text-primary">{i < visibleItems ? `$${item.rate}` : ''}</td>
                        <td className="py-4 text-right align-top text-primary">{i < visibleItems ? `$${item.amount}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-6 border-t border-border-subtle">
                <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="text-primary">{showTotals ? '$3,100.00' : '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Discount</span>
                    <span className="text-primary">{showTotals ? '-$0.00' : '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>VAT (10%)</span>
                    <span className="text-primary">{showTotals ? '$310.00' : '—'}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-primary pt-2 border-t border-border-subtle">
                    <span>Total Due</span>
                    <span className={`rounded px-1 transition-all ${showTotals ? 'anim-highlight bg-secondary/10' : ''}`}>
                      {showTotals ? '$3,410.00' : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Notes */}
              <div className="mt-20 pt-6 border-t border-border-subtle">
                <div className="text-[11px] uppercase tracking-wider text-on-surface-variant mb-2">Payment Notes</div>
                <div className="text-[10px] text-on-surface-variant mb-2">Thank you for your business. Payment is due within 30 days.</div>
                <div className="text-[10px] text-on-surface-variant">
                  <span className="font-semibold text-primary">Payment Terms:</span> Due within 30 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
