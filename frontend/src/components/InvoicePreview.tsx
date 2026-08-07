import { AgencyTemplate } from './invoice-templates/AgencyTemplate';
import { CorporateTemplate } from './invoice-templates/CorporateTemplate';
import { ElegantTemplate } from './invoice-templates/ElegantTemplate';
import { MinimalTemplate } from './invoice-templates/MinimalTemplate';
import { ModernTemplate } from './invoice-templates/ModernTemplate';
import type { InvoicePreviewProps } from './invoice-templates/shared';

export type { InvoicePreviewProps } from './invoice-templates/shared';

export function InvoicePreview(props: InvoicePreviewProps) {
  switch (props.template) {
    case 'corporate':
      return <CorporateTemplate {...props} />;
    case 'modern':
      return <ModernTemplate {...props} />;
    case 'agency':
      return <AgencyTemplate {...props} />;
    case 'elegant':
      return <ElegantTemplate {...props} />;
    case 'minimal':
    default:
      return <MinimalTemplate {...props} />;
  }
}
