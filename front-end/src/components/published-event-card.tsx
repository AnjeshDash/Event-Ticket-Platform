import { PublishedEventSummary } from "@/domain/domain";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";
import { useState } from "react";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "TBD";
    try {
      return format(date, "PP");
    } catch {
      return "TBD";
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: publishedEvent.name,
        text: `Check out ${publishedEvent.name} at ${publishedEvent.venue}`,
        url: window.location.origin + `/events/${publishedEvent.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/events/${publishedEvent.id}`
      );
    }
  };

  return (
    <Link to={`/events/${publishedEvent.id}`} className="block">
      <Card 
        className={`
          overflow-hidden max-w-[280px] card-3d transition-all duration-300
          ${isHovered ? 'transform scale-105' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Image with Overlay */}
        <div className="relative h-[180px] overflow-hidden group">
          <RandomEventImage />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Floating Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLike}
              className={`
                w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center
                transition-all duration-200 hover:scale-110
                ${isLiked ? 'text-red-500' : 'text-gray-600'}
              `}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 transition-all duration-200 hover:scale-110"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Event Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
              Available
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Event Name */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
            {publishedEvent.name}
          </h3>

          {/* Venue */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{publishedEvent.venue}</span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>
              {publishedEvent.start && publishedEvent.end ? (
                <>
                  {formatDate(publishedEvent.start)} - {formatDate(publishedEvent.end)}
                </>
              ) : (
                "Dates TBD"
              )}
            </span>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Available</span>
            </div>
            
            {publishedEvent.start && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {format(publishedEvent.start, "p")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent
          pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `} />
      </Card>
    </Link>
  );
};

export default PublishedEventCard;
