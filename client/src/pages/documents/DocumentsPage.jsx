import React from 'react';
import { FileText, Upload, File as FileIcon, MoreVertical, CreditCard, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/Button';

const DOCUMENTS = [
  { id: 1, title: 'Passport (Thranae)', type: 'ID', size: '2.4 MB', updated: 'Oct 01', icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 2, title: 'Japan Tourist Visa', type: 'Visa', size: '1.1 MB', updated: 'Oct 05', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 3, title: 'ANA Flight Tickets', type: 'Tickets', size: '850 KB', updated: 'Oct 08', icon: Ticket, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function DocumentsPage() {
  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-text-primary"
          >
            Travel Documents
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-lg font-medium text-text-secondary"
          >
            Securely store and access your important files.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload Area */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-1">
          <div className="glass-card p-8 rounded-[24px] border border-dashed border-white/20 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)]/10 transition-colors">
              <Upload className="w-8 h-8 text-text-secondary group-hover:text-[var(--color-accent)] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Upload Document</h3>
            <p className="text-sm text-text-secondary mb-6">Drag and drop your files here or click to browse.</p>
            <Button variant="secondary" className="px-6">Select File</Button>
            <p className="text-xs text-text-secondary mt-4 opacity-70">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
          </div>
        </motion.div>

        {/* Right Column: Document Grid */}
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="show" 
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {DOCUMENTS.map((doc) => (
            <motion.div key={doc.id} variants={fadeUp} className="glass-card p-5 rounded-[24px] group border border-white/5 hover:border-white/10 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl ${doc.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <doc.icon className={`w-6 h-6 ${doc.color}`} />
                </div>
                <button className="text-text-secondary hover:text-text-primary p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-auto">
                <h4 className="font-bold text-text-primary text-lg mb-1 truncate">{doc.title}</h4>
                <div className="flex items-center justify-between text-sm text-text-secondary font-medium">
                  <span>{doc.type} • {doc.size}</span>
                  <span>{doc.updated}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* AI Organizer Placeholder */}
          <motion.div variants={fadeUp} className="glass-card p-5 rounded-[24px] border border-white/5 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 flex flex-col justify-center relative overflow-hidden group min-h-[160px]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileIcon className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-text-primary text-lg mb-2">Smart Organization</h4>
              <p className="text-sm text-text-secondary mb-4 pr-10">Our AI automatically categorizes and extracts key dates from your uploads.</p>
              <div className="inline-flex items-center text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Active
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

