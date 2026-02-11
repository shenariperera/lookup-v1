import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OfferCard({ 
  image,
  title,
  companyName,
  companyLogo,
  href,
  onClick
}) {
  
  return (
    <Card padding="none" className="group max-w-sm">
      {/* Offer Image */}
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {image ? (
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Offer Title */}
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        {/* Company Info */}
        <div className="flex items-center gap-3">
          {companyLogo ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <Image 
                src={companyLogo} 
                alt={companyName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary-600">
                {companyName?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600 truncate">{companyName}</span>
        </div>

        {/* View Offer Button */}
        <Button 
          variant="accent" 
          size="small"
          fullWidth
          href={href}
          onClick={onClick}
        >
          View Offer
        </Button>
      </div>
    </Card>
  );
}