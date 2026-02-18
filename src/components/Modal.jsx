import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

export default function Modal({ isOpen, title, onClose, children }){
  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function AddHolidayModal({ isOpen, onClose, onSubmit, initialData }){
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if(initialData && isOpen){
      setName(initialData.name || '');
      // Convert date to YYYY-MM-DD format for input
      const start = new Date(initialData.startDate);
      const end = new Date(initialData.endDate);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    } else if(!isOpen){
      // Clear when modal closes
      setName('');
      setStartDate('');
      setEndDate('');
      setError('');
    }
  }, [initialData, isOpen]);

  function handleSubmit(){
    if(!name.trim() || !startDate || !endDate){
      setError('All fields are required');
      return;
    }
    if(new Date(startDate) > new Date(endDate)){
      setError('Start date must be before end date');
      return;
    }
    onSubmit({ name, startDate, endDate });
    setName('');
    setStartDate('');
    setEndDate('');
    setError('');
  }

  const isEditing = !!initialData;

  return (
    <Modal isOpen={isOpen} title={isEditing ? "Edit Holiday" : "Add Holiday"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Holiday Name <span className="text-red-600">*</span></label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
            type="text" 
            placeholder="e.g. Diwali" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Start Date <span className="text-red-600">*</span></label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
            type="date" 
            value={startDate} 
            onChange={e=>setStartDate(e.target.value)}
            onFocus={e=>e.target.showPicker?.()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">End Date <span className="text-red-600">*</span></label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
            type="date" 
            value={endDate} 
            onChange={e=>setEndDate(e.target.value)}
            onFocus={e=>e.target.showPicker?.()}
          />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <div className="flex gap-2 pt-4">
          <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base">{isEditing ? "Update" : "Add"}</button>
          <button onClick={onClose} className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm md:text-base">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

export function AddSemesterModal({ isOpen, onClose, onSubmit, initialData }){
  const [name, setName] = useState('');
  const [mid1Date, setMid1Date] = useState('');
  const [mid2Date, setMid2Date] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if(initialData && isOpen){
      setName(initialData.name || '');
      const m1 = initialData.mid1Date ? new Date(initialData.mid1Date) : null;
      const m2 = initialData.mid2Date ? new Date(initialData.mid2Date) : null;
      setMid1Date(m1 ? m1.toISOString().split('T')[0] : '');
      setMid2Date(m2 ? m2.toISOString().split('T')[0] : '');
    } else if(!isOpen){
      setName('');
      setMid1Date('');
      setMid2Date('');
      setError('');
    }
  }, [initialData, isOpen]);

  function handleSubmit(){
    if(!name.trim()){
      setError('Semester name is required');
      return;
    }
    if(mid1Date && mid2Date && new Date(mid1Date) > new Date(mid2Date)){
      setError('Mid1 date must be before Mid2 date');
      return;
    }
    onSubmit({ name, mid1Date: mid1Date||null, mid2Date: mid2Date||null });
    setName('');
    setMid1Date('');
    setMid2Date('');
    setError('');
  }

  const isEditing = !!initialData;

  return (
    <Modal isOpen={isOpen} title={isEditing ? "Edit Semester" : "Create Semester"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Semester Name</label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
            type="text" 
            placeholder="e.g. Semester 1" 
            value={name} 
            onChange={e=>setName(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Mid 1 Date <span className="text-slate-500">(optional)</span></label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
            type="date" 
            value={mid1Date} 
            onChange={e=>setMid1Date(e.target.value)}
            onFocus={e=>e.target.showPicker?.()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Mid 2 Date <span className="text-slate-500">(optional)</span></label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
            type="date" 
            value={mid2Date} 
            onChange={e=>setMid2Date(e.target.value)}
            onFocus={e=>e.target.showPicker?.()}
          />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <div className="flex gap-2 pt-4">
          <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">{isEditing ? "Update" : "Create"}</button>
          <button onClick={onClose} className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }){
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-slate-700">{message}</p>
        <div className="flex gap-2 pt-4">
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">Delete</button>
          <button onClick={onCancel} className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

export function AddExtraModal({ isOpen, onClose, onSubmit, editingAdjustment, currentHolidays = [], currentWorking = [] }){
  const [activeTab, setActiveTab] = useState('holiday');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [extraHolidays, setExtraHolidays] = useState([]);
  const [extraWorking, setExtraWorking] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if(isOpen){
      setExtraHolidays([...currentHolidays]);
      setExtraWorking([...currentWorking]);
      
      if(editingAdjustment){
        // Pre-fill form for editing
        setStartDate(editingAdjustment.startDate);
        setEndDate(editingAdjustment.endDate);
        setActiveTab(editingAdjustment.type === 'holiday' ? 'holiday' : 'working');
      } else {
        // New addition - clear form
        setStartDate('');
        setEndDate('');
        setActiveTab('holiday');
      }
    }
  }, [isOpen, editingAdjustment, currentHolidays, currentWorking]);

  function handleAdd(){
    if(!startDate || !endDate){
      setError('Both dates are required');
      return;
    }
    if(new Date(startDate) > new Date(endDate)){
      setError('Start date must be before end date');
      return;
    }
    
    const newItem = { startDate, endDate };
    
    if(editingAdjustment){
      // In editing mode, update and close
      if(editingAdjustment.type === 'holiday'){
        const updated = extraHolidays.map((h, i) => i === editingAdjustment.index ? newItem : h);
        onSubmit(updated, extraWorking);
      } else {
        const updated = extraWorking.map((w, i) => i === editingAdjustment.index ? newItem : w);
        onSubmit(extraHolidays, updated);
      }
      setStartDate('');
      setEndDate('');
      setError('');
    } else {
      // In add mode, accumulate items
      if(activeTab === 'holiday'){
        setExtraHolidays([...extraHolidays, newItem]);
      } else {
        setExtraWorking([...extraWorking, newItem]);
      }
      setStartDate('');
      setEndDate('');
      setError('');
    }
  }

  function handleRemove(type, idx){
    if(type === 'holiday'){
      setExtraHolidays(extraHolidays.filter((_, i) => i !== idx));
    } else {
      setExtraWorking(extraWorking.filter((_, i) => i !== idx));
    }
  }

  function handleSubmit(dataToSubmit){
    const finalHolidays = dataToSubmit || extraHolidays;
    const finalWorking = dataToSubmit ? extraWorking.filter((_, i) => !dataToSubmit.includes(extraWorking[i])) : extraWorking;
    
    onSubmit(finalHolidays, finalWorking);
    setExtraHolidays([]);
    setExtraWorking([]);
    setStartDate('');
    setEndDate('');
    setError('');
    setActiveTab('holiday');
  }

  function handleFinalSubmit(){
    handleSubmit();
  }

  const isEditing = !!editingAdjustment;

  return (
    <Modal isOpen={isOpen} title={isEditing ? "Edit Adjustment" : "Adjustments"} onClose={onClose}>
      <div className="space-y-4">
        {!isEditing && (
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('holiday')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${activeTab === 'holiday' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              Holiday
            </button>
            <button 
              onClick={() => setActiveTab('working')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${activeTab === 'working' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              Working Day
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" 
            type="date" 
            value={startDate} 
            onChange={e=>setStartDate(e.target.value)}
            onFocus={e=>e.target.showPicker?.()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
          <input 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" 
            type="date" 
            value={endDate} 
            onChange={e=>setEndDate(e.target.value)}
            onFocus={e=>e.target.showPicker?.()}
          />
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        {isEditing ? (
          <div className="flex gap-2 pt-4">
            <button 
              onClick={handleAdd}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base">
              Update
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm md:text-base">
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={handleAdd}
              className={`w-full py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${activeTab === 'holiday' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
              Add
            </button>

            {(extraHolidays.length > 0 || extraWorking.length > 0) && (
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                {extraHolidays.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">🟢 {new Date(h.startDate).toLocaleDateString()} to {new Date(h.endDate).toLocaleDateString()}</span>
                    <button onClick={() => handleRemove('holiday', i)} className="text-red-600 text-xs hover:text-red-800">Remove</button>
                  </div>
                ))}
                {extraWorking.map((w, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">🔴 {new Date(w.startDate).toLocaleDateString()} to {new Date(w.endDate).toLocaleDateString()}</span>
                    <button onClick={() => handleRemove('working', i)} className="text-red-600 text-xs hover:text-red-800">Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button 
                onClick={handleFinalSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base">
                Add All
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm md:text-base">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
