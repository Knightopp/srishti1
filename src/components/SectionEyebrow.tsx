import React from 'react'

interface SectionEyebrowProps {
  label: string
  tag?: string
}

const SectionEyebrow: React.FC<SectionEyebrowProps> = ({ label, tag }) => (
  <div className="flex items-center gap-3">
    <span className="w-1.5 h-1.5 rounded-full bg-white" />
    <span className="text-xs uppercase tracking-widest text-white/70 font-medium">
      {label}
    </span>
    {tag && (
      <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/50 text-xs">
        {tag}
      </span>
    )}
  </div>
)

export default SectionEyebrow
