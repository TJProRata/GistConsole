"use client";

type IconType = 'question' | 'world' | 'pencil';

interface PricingFeature {
  icon: IconType;
  text: string;
}

interface PricingCardProps {
  badge?: string;
  title: string;
  price: string;
  features: PricingFeature[];
  ctaText: string;
  onSelect: () => void;
  className?: string;
}

const IconComponent = ({ type }: { type: IconType }) => {
  switch (type) {
    case 'question':
      return (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="1.5" fill="none"/>
          <path d="M12 17V17.01M12 14C12 13.5 12.2 13.1 12.6 12.8C13.4 12.3 14 11.5 14 10.5C14 9.1 12.9 8 11.5 8C10.4 8 9.5 8.7 9.2 9.7"
                stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'world':
      return (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="1.5" fill="none"/>
          <path d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22"
                stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'pencil':
      return (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
};

const SparkleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill="url(#sparkle-gradient)" stroke="url(#sparkle-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sparkle-gradient" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A361E9"/>
        <stop offset="1" stopColor="#FB9649"/>
      </linearGradient>
    </defs>
  </svg>
);

export function PricingCard({
  badge,
  title,
  price,
  features,
  ctaText,
  onSelect,
  className = '',
}: PricingCardProps) {
  return (
    <div
      className={`flex flex-col cursor-pointer ${className}`}
      style={{
        width: '224px',
        height: '304px',
        borderRadius: '24px',
        padding: '16px',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #6F61EF 0%, #E19736 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        border: '1px solid transparent',
      }}
      onClick={onSelect}
    >
      {/* Badge */}
      {badge && (
        <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
          <SparkleIcon />
          <span
            style={{
              color: '#6B7280',
              fontSize: '11px',
              fontFamily: 'Work Sans, sans-serif',
              fontWeight: 400,
            }}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Title */}
      <h3
        style={{
          color: '#151022',
          fontSize: '19px',
          fontFamily: 'Work Sans, sans-serif',
          fontWeight: 600,
          marginBottom: '10px',
        }}
      >
        {title}
      </h3>

      {/* Price */}
      <div
        style={{
          backgroundImage: 'linear-gradient(90deg, #A361E9 0%, #FB9649 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '38px',
          fontFamily: 'Work Sans, sans-serif',
          fontWeight: 600,
          marginBottom: '16px',
          lineHeight: '1',
        }}
      >
        {price}
      </div>

      {/* Features */}
      <div className="flex flex-col flex-1" style={{ gap: '10px', marginBottom: '16px' }}>
        {features.map((feature, index) => (
          <div key={index} className="flex items-center" style={{ gap: '10px' }}>
            <div
              style={{
                width: '29px',
                height: '29px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconComponent type={feature.icon} />
            </div>
            <span
              style={{
                color: '#151022',
                fontSize: '13px',
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 400,
                lineHeight: '1.4',
              }}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className="w-full transition-opacity hover:opacity-90 mt-auto"
        style={{
          height: '38px',
          borderRadius: '16px',
          background: 'linear-gradient(270deg, rgba(225, 151, 54, 0.40) 51%, rgba(111, 97, 239, 0.40) 100%)',
          border: 'none',
          color: '#151022',
          fontSize: '13px',
          fontFamily: 'Work Sans, sans-serif',
          fontWeight: 500,
          lineHeight: '22.40px',
          letterSpacing: '0.32px',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {ctaText}
      </button>
    </div>
  );
}
