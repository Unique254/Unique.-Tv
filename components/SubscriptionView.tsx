import React, { useState } from 'react';
import { MOCK_SUBSCRIPTION_PLANS } from '../constants';
import { SubscriptionPlan, SubscriptionDuration, PaymentResponse } from '../types';

const SubscriptionView: React.FC = () => {
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>(SubscriptionDuration.MONTHLY);

  const filteredPlans = MOCK_SUBSCRIPTION_PLANS.filter(p => 
    selectedDuration === SubscriptionDuration.ANNUAL 
      ? p.duration === SubscriptionDuration.ANNUAL 
      : p.duration === SubscriptionDuration.MONTHLY
  );

  const handlePayment = () => {
    if (!selectedPlanForPayment) return;
    setIsProcessing(true);
    
    // Simulate Android PaymentResponse behavior
    setTimeout(() => {
      const response: PaymentResponse = {
        success: true,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: "Payment Successful! Your Premium benefits are now active.",
        subscription: {
          userId: "current-user-id",
          planId: selectedPlanForPayment.id,
          planName: selectedPlanForPayment.name,
          devices: selectedPlanForPayment.devices,
          deviceIds: ["device-1"],
          startDate: Date.now(),
          endDate: Date.now() + (selectedDuration === SubscriptionDuration.ANNUAL ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          paymentMethod: "Credit Card",
          transactionId: "TXN-SIMULATED-123"
        }
      };

      setIsProcessing(false);
      setSelectedPlanForPayment(null);
      alert(response.message);
    }, 2500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">Choose Your <span className="text-red-600">Experience</span></h2>
        <p className="text-zinc-500 max-w-2xl mx-auto font-medium">Synchronized with Unique-Core billing nodes. Unlock 4K streaming and AI neural rendering.</p>
      </div>

      {/* Duration Switcher - Synchronized with SubscriptionDuration enum */}
      <div className="flex justify-center mb-12">
        <div className="bg-zinc-900/60 p-1.5 rounded-[24px] border border-white/5 flex backdrop-blur-md shadow-2xl">
          {[SubscriptionDuration.MONTHLY, SubscriptionDuration.ANNUAL].map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedDuration === duration ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {duration} {duration === SubscriptionDuration.ANNUAL && <span className="ml-1 text-[8px] text-red-600 animate-pulse">Save 30%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {filteredPlans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-10 rounded-[48px] border transition-all duration-500 group flex flex-col hover:scale-[1.02] active:scale-95 ${
              plan.id !== 'p1' 
                ? 'bg-red-600 border-red-500 text-white shadow-2xl shadow-red-900/30' 
                : 'bg-zinc-900/40 border-white/10 text-zinc-100'
            }`}
          >
            {plan.discountPercent && plan.discountPercent > 0 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-red-600 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-red-100/50">
                Save {plan.discountPercent}%
              </div>
            )}
            
            <div className="mb-10">
              <h3 className="text-2xl font-black tracking-tighter mb-2 uppercase italic">{plan.name}</h3>
              <p className={`text-xs font-bold mb-6 ${plan.id !== 'p1' ? 'text-red-100/70' : 'text-zinc-500'}`}>{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">${plan.finalPrice}</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${plan.id !== 'p1' ? 'text-red-100/50' : 'text-zinc-600'}`}>/{plan.duration === SubscriptionDuration.ANNUAL ? 'year' : 'mo'}</span>
              </div>
              {plan.price !== plan.finalPrice && (
                <p className="text-xs line-through opacity-50 font-bold mt-1">${plan.price}</p>
              )}
            </div>

            <div className="flex-1 space-y-5 mb-12">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${plan.id !== 'p1' ? 'bg-white/20 text-white' : 'bg-red-600/20 text-red-600'}`}>
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{plan.devices} {plan.devices === 1 ? 'Device' : 'Devices'} Ready</span>
              </div>
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${plan.id !== 'p1' ? 'bg-white' : 'bg-red-600'}`}></div>
                  <span className="text-sm font-bold opacity-90">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setSelectedPlanForPayment(plan)}
              className={`w-full py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform hover:shadow-2xl ${
              plan.id !== 'p1' 
                ? 'bg-white text-red-600 hover:bg-zinc-100' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-900/20'
            }`}>
              {plan.id !== 'p1' ? 'Activate Premium' : 'Select Basic'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Activity / Secure Checkout Dialog */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-900 rounded-[56px] border border-white/10 p-12 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Secure <span className="text-red-600">Checkout</span></h3>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-2">Node: Unique-Secure-Payment-API</p>
              </div>
              <button onClick={() => setSelectedPlanForPayment(null)} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-zinc-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-black/40 rounded-[32px] p-8 mb-10 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Plan Node</span>
                <span className="text-white font-black uppercase text-xs tracking-widest">{selectedPlanForPayment.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Billing Cycle</span>
                <span className="text-white font-black uppercase text-xs tracking-widest">{selectedPlanForPayment.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Simultaneous Streams</span>
                <span className="text-white font-black uppercase text-xs tracking-widest">{selectedPlanForPayment.devices} Devices</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Total Liability</span>
                <span className="text-red-600 font-black text-2xl">${selectedPlanForPayment.finalPrice}</span>
              </div>
            </div>

            <div className="space-y-4 mb-10">
               <div className="bg-black/40 border border-white/5 p-5 rounded-[24px] flex items-center gap-6 group cursor-pointer hover:border-red-600/30 transition-all">
                 <div className="w-12 h-8 bg-zinc-800 rounded-lg border border-white/10 flex items-center justify-center font-black text-[9px] text-zinc-400 italic">VISA</div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-zinc-300">•••• •••• •••• 9021</p>
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Expires 12/28</p>
                 </div>
                 <button className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-500">Switch</button>
               </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black rounded-[24px] text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-red-900/40"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Finalize Transaction
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-20 p-10 bg-zinc-900/20 border border-white/5 rounded-[48px] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2">Corporate Support</p>
          <h4 className="text-xl font-black tracking-tight uppercase">Need a Custom Enterprise Solution?</h4>
          <p className="text-zinc-500 text-sm mt-1 font-medium italic">High-volume licensing and HLS node deployment available.</p>
        </div>
        <button className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Contact Sales</button>
      </div>
      
      <p className="text-center mt-12 text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">Encrypted End-to-End via Unique-Vault Protocol v3.1</p>
    </div>
  );
};

export default SubscriptionView;