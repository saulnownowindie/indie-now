import "./PageLayout.css";

import PageHeader from "../ui/PageHeader";

export default function PageLayout({
  title,
  description,
  action = null,
  filters = null,
  children,
}) {
  return (
    <section className="page-layout">
      <PageHeader
        title={title}
        description={description}
        action={action}
      />

      {filters && (
        <div className="page-layout__filters">
          {filters}
        </div>
      )}

      <div className="page-layout__content">
        {children}
      </div>
    </section>
  );
}