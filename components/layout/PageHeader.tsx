interface PageHeaderProps {
    title: string;
    description?: string;
  }
  
  export function PageHeader({ title, description }: PageHeaderProps) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {description}
          </p>
        )}
      </div>
    );
  }