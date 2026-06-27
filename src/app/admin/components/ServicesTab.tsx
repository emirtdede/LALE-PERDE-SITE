import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDb } from '@/context/DbContext';
import { ServiceItem } from '@/context/dbTypes';
import { useLanguage } from '@/context/LanguageContext';


const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);



export default function ServicesTab() {
  const { services: dbServices, addService, updateService, deleteService } = useDb();
  const { t, language } = useLanguage();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState('');
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  // Drag and Drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const list = [...services];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, draggedItem);

    const updatedList = list.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    setServices(updatedList);
    for (const s of updatedList) {
      await updateService(s);
    }
    setDraggedIndex(null);
  };

  useEffect(() => {
    setPortalTarget(document.getElementById('admin-tab-actions'));
  }, []);

  useEffect(() => {
    if (dbServices) {
      setServices([...dbServices].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [dbServices]);

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setEditForm({
      ...service
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId('new');
    setEditForm({
      id: `srv-${Date.now()}`,
      titleTr: '',
      titleEn: '',
      descriptionTr: '',
      descriptionEn: '',
      status: 'active',
      displayOrder: services.length + 1
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.services.alerts.confirmDelete'))) return;
    await deleteService(id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setIsAddingNew(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };



  const handleSave = async () => {
    if (!editingId) return;
    const finalForm = { ...editForm, id: editForm.id || `srv-${Date.now()}` } as ServiceItem;
    if (isAddingNew || editingId === 'new') {
      await addService(finalForm);
    } else {
      await updateService(finalForm);
    }
    handleCancel();
  };

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', color: '#A3B3C2', marginBottom: '0.5rem', fontWeight: 500 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.8rem', background: 'rgba(15,24,32,0.8)', border: '1px solid rgba(189,149,75,0.3)', borderRadius: '4px', color: '#FFF', outline: 'none', fontSize: '0.9rem' };

  return (
    <div>

      {error && (
        <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', padding: '1rem', borderRadius: '4px', border: '1px solid #DC2626', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {portalTarget && !editingId && createPortal(
        <button
          onClick={handleAddNew}
          style={{ background: 'linear-gradient(135deg, #BD954B, #A57E3B)', color: '#FFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
        >
          {t('admin.services.addNew')}
        </button>,
        portalTarget
      )}

      {editingId ? (
        <div style={{ backgroundColor: '#0F1820', borderRadius: '8px', border: '1px solid rgba(189, 149, 75, 0.3)', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#FFF', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            {isAddingNew ? t('admin.services.addNewTitle') : t('admin.services.editTitle')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.services.titleTr')}</label>
                <input type="text" name="titleTr" value={editForm.titleTr || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.services.titleEn')}</label>
                <input type="text" name="titleEn" value={editForm.titleEn || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.services.descTr')}</label>
                <textarea name="descriptionTr" value={editForm.descriptionTr || ''} onChange={handleChange} rows={3} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.services.descEn')}</label>
                <textarea name="descriptionEn" value={editForm.descriptionEn || ''} onChange={handleChange} rows={3} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.services.displayOrder')}</label>
                <input type="number" name="displayOrder" value={editForm.displayOrder || 1} onChange={(e) => setEditForm({...editForm, displayOrder: parseInt(e.target.value, 10) || 1})} style={inputStyle} min={1} />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.services.status')}</label>
                <select name="status" value={editForm.status || 'active'} onChange={handleChange} style={inputStyle}>
                  <option value="active">{t('admin.services.statusActive')}</option>
                  <option value="passive">{t('admin.services.statusPassive')}</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #BD954B, #A57E3B)', color: '#FFF', border: 'none', padding: '0.8rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>{t('admin.services.save')}</button>
              <button onClick={handleCancel} style={{ background: 'transparent', color: '#A3B3C2', border: '1px solid #A3B3C2', padding: '0.8rem 2rem', borderRadius: '4px', cursor: 'pointer' }}>{t('admin.services.cancel')}</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#0F1820', borderRadius: '8px', border: '1px solid rgba(189, 149, 75, 0.15)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#E0E6ED', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(189, 149, 75, 0.2)' }}>
              <tr>
                <th style={{ padding: '1rem', width: '40px' }}></th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>{t('admin.services.table.title')}</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>{t('admin.services.table.desc')}</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>{t('admin.services.table.status')}</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>{t('admin.services.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.services.table.noData')}</td></tr>
              ) : (
                services.map((service, idx) => (
                  <tr 
                    key={service.id} 
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      backgroundColor: draggedIndex === idx ? 'rgba(189, 149, 75, 0.1)' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <td style={{ padding: '1rem', color: 'rgba(189, 149, 75, 0.6)', cursor: 'grab', userSelect: 'none', textAlign: 'center' }}>
                      ☰
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      {language === 'tr' ? service.titleTr : service.titleEn}
                    </td>
                    <td style={{ padding: '1rem', color: '#A3B3C2', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {language === 'tr' ? service.descriptionTr : service.descriptionEn}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: service.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: service.status === 'active' ? '#10B981' : '#EF4444'
                      }}>
                        {service.status === 'active' ? t('admin.services.statusActive') : t('admin.services.statusPassive')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleEdit(service)}
                          style={{ background: 'rgba(189, 149, 75, 0.1)', border: '1px solid rgba(189,149,75,0.2)', color: 'var(--color-accent)', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <EditIcon />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
}
