import type { ReactNode } from 'react'
import { EditableNavbar } from '@/editable/shell/EditableNavbar'
import { EditableFooter } from '@/editable/shell/EditableFooter'
import { EditablePageMotion } from '@/editable/shell/EditablePageMotion'
import { EditableBackToTop } from '@/editable/components/EditableMotion'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableSiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`editable-site-root ${dc.shell.page} flex min-h-screen flex-col ${className}`}>
      {/* Scroll-reveal is JS-driven; without scripting every block stays visible. */}
      <noscript>
        <style>{`.iso-reveal{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <EditableNavbar />
      <EditablePageMotion>{children}</EditablePageMotion>
      <EditableFooter />
      <EditableBackToTop />
    </div>
  )
}
