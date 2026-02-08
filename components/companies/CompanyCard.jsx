import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CompanyCard({ 
  image, 
  logo, 
  name,
  category,
  address,
  description,
  href,
  onClick
}) {
  
  return (
    <Card padding="none" className="group max-w-sm">
      {/* Company Image - Top */}
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {image ? (
          <Image 
            src={image} 
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-primary-600">
                {name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        
        {/* Small Logo Badge - Positioned on image */}
        {logo && (
          <div className="absolute bottom-4 left-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
              <Image 
                src={logo} 
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Category Tag */}
        {category && (
          <span className="inline-block text-xs uppercase tracking-wide font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-sm">
            {category}
          </span>
        )}

        {/* Company Name */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
          {name}
        </h3>

        {/* Address */}
        {address && (
          <div className="flex items-start gap-2">
            <svg 
              className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-600 line-clamp-2">
              {address}
            </p>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* View Promotions Button */}
        <Button 
          variant="primary"
          size="small"
          fullWidth
          href={href}
          onClick={onClick}
        >
          View Promotions
        </Button>
      </div>
    </Card>
  );
}