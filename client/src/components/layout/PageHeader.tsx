interface PageHeaderProps {
  title: string;
  description?: string;
  image?: string;
}

export default function PageHeader({
  title,
  description,
  image,
}: PageHeaderProps) {
  return (
    <div className="relative py-14 md:py-20 overflow-hidden bg-nagari-navy border-b border-white/10">
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-br from-nagari-navy via-nagari-navy to-nagari-red/40" />

      {image && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-nagari-navy/75 via-nagari-navy/65 to-nagari-navy/90" />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <div aria-hidden="true" className="inline-block h-1 w-14 bg-nagari-yellow mb-5 rounded-full" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
