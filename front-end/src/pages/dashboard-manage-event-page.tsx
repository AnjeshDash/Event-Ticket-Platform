import NavBar from "@/components/nav-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateEventRequest,
  CreateTicketTypeRequest,
  EventDetails,
  EventStatusEnum,
  UpdateEventRequest,
  UpdateTicketTypeRequest,
} from "@/domain/domain";
import { createEvent, getEvent, updateEvent } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CalendarIcon,
  Edit,
  Plus,
  Ticket,
  Trash,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";
import { useNavigation } from "@/hooks/use-navigation";
//errors
interface DateTimeSelectProperties {
  date: Date | undefined;
  setDate: (date: Date) => void;
  time: string | undefined;
  setTime: (time: string) => void;
  enabled: boolean;
  setEnabled: (isEnabled: boolean) => void;
}
//
const DateTimeSelect: React.FC<DateTimeSelectProperties> = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 border-2 border-gray-400"
      />
      
      <div className={`transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-50'}`}>
        {enabled ? (
          <div className="w-full flex gap-2">
            {/* Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-primary text-primary-foreground border border-primary/20 hover:bg-primary/90">
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (!selectedDate) {
                      return;
                    }
                    const displayedYear = selectedDate.getFullYear();
                    const displayedMonth = selectedDate.getMonth();
                    const displayedDay = selectedDate.getDate();

                    const correctedDate = new Date(
                      Date.UTC(displayedYear, displayedMonth, displayedDay),
                    );

                    setDate(correctedDate);
                  }}
                />
              </PopoverContent>
            </Popover>
            {/* Time */}
            <div className="flex gap-2 items-center">
              <Input
                type="time"
                className="w-[90px] bg-background text-foreground border border-border"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="w-full flex gap-2 items-center text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm">Date and time not set</span>
          </div>
        )}
      </div>
    </div>
  );
};

const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id: string | undefined) => id && id.startsWith("temp_");

interface TicketTypeData {
  id: string | undefined;
  name: string;
  price: number;
  totalAvailable?: number;
  description: string;
}

interface EventData {
  id: string | undefined;
  name: string;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
  venueDetails: string;
  salesStartDate: Date | undefined;
  salesStartTime: string | undefined;
  salesEndDate: Date | undefined;
  salesEndTime: string | undefined;
  ticketTypes: TicketTypeData[];
  status: EventStatusEnum;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

const DashboardManageEventPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { goBackSmart } = useNavigation();

  const [eventData, setEventData] = useState<EventData>({
    id: undefined,
    name: "",
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: "",
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatusEnum.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState<
    TicketTypeData | undefined
  >();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);

  const [error, setError] = useState<string | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof EventData, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token) {
      const fetchEvent = async () => {
        const event: EventDetails = await getEvent(user.access_token, id);
        setEventData({
          id: event.id,
          name: event.name,
          startDate: event.start,
          startTime: event.start
            ? formatTimeFromDate(new Date(event.start))
            : undefined,
          endDate: event.end,
          endTime: event.end
            ? formatTimeFromDate(new Date(event.end))
            : undefined,
          venueDetails: event.venue,
          salesStartDate: event.salesStart,
          salesStartTime: event.salesStart
            ? formatTimeFromDate(new Date(event.salesStart))
            : undefined,
          salesEndDate: event.salesEnd,
          salesEndTime: event.salesEnd
            ? formatTimeFromDate(new Date(event.salesEnd))
            : undefined,
          status: event.status,
          ticketTypes: event.ticketTypes.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            totalAvailable: ticket.totalAvailable,
          })),
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
        setEventDateEnabled(!!(event.start || event.end));
        setEventSalesDateEnabled(!!(event.salesStart || event.salesEnd));
      };
      fetchEvent();
    }
  }, [id, user]);

  const formatTimeFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time
      .split(":")
      .map((num) => Number.parseInt(num, 10));

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);

    const utcResult = new Date(
      Date.UTC(
        combinedDateTime.getFullYear(),
        combinedDateTime.getMonth(),
        combinedDateTime.getDate(),
        hours,
        minutes,
        0,
        0,
      ),
    );

    return utcResult;
  };

  const handleEventUpdateSubmit = async (accessToken: string, id: string) => {
    const ticketTypes: UpdateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          id: isTempId(ticketType.id) ? undefined : ticketType.id,
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: UpdateEventRequest = {
      id: id,
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await updateEvent(accessToken, id, request);
      navigate("/dashboard/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleEventCreateSubmit = async (accessToken: string) => {
    const ticketTypes: CreateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: CreateEventRequest = {
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await createEvent(accessToken, request);
      navigate("/dashboard/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !user || !user.access_token) {
      console.error("User not found!");
      return;
    }

    if (isEditMode) {
      if (!eventData.id) {
        setError("Event does not have an ID");
        return;
      }
      await handleEventUpdateSubmit(user.access_token, eventData.id);
    } else {
      await handleEventCreateSubmit(user.access_token);
    }
  };

  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: "",
      price: 0,
      totalAvailable: 0,
      description: "",
    });
    setDialogOpen(true);
  };

  const handleSaveTicketType = () => {
    if (!currentTicketType) {
      return;
    }

    const newTicketTypes = [...eventData.ticketTypes];

    if (currentTicketType.id) {
      const index = newTicketTypes.findIndex(
        (t) => t.id === currentTicketType.id,
      );
      if (index !== -1) {
        newTicketTypes[index] = currentTicketType;
      }
    } else {
      newTicketTypes.push({
        ...currentTicketType,
        id: generateTempId(),
      });
    }

    updateField("ticketTypes", newTicketTypes);
    setDialogOpen(false);
  };

  const handleEditTicketType = (ticketType: TicketTypeData) => {
    setCurrentTicketType(ticketType);
    setDialogOpen(true);
  };

  const handleDeleteTicketType = (id: string | undefined) => {
    if (!id) {
      return;
    }
    updateField(
      "ticketTypes",
      eventData.ticketTypes.filter((t) => t.id !== id),
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goBackSmart}
              className="interactive"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">
                {isEditMode ? "Edit Event" : "Create a New Event"}
              </h1>
            </div>
          </div>
          {isEditMode ? (
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {eventData.id && (
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                  ID: {eventData.id}
                </span>
              )}
              {eventData.createdAt && (
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                  Created: {format(eventData.createdAt, "PPP")}
                </span>
              )}
              {eventData.updatedAt && (
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                  Updated: {format(eventData.updatedAt, "PPP")}
                </span>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Fill out the form below to create your event</p>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Event Name */}
              <div className="space-y-2">
                <Label htmlFor="event-name" className="text-sm font-medium text-foreground">
                  Event Name
                </Label>
                <Input
                  id="event-name"
                  placeholder="Enter your event name"
                  value={eventData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  This is the public name of your event.
                </p>
              </div>

              {/* Event Start Date Time */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Event Start</Label>
                <DateTimeSelect
                  date={eventData.startDate}
                  setDate={(date) => updateField("startDate", date)}
                  time={eventData.startTime}
                  setTime={(time) => updateField("startTime", time)}
                  enabled={eventDateEnabled}
                  setEnabled={setEventDateEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  The date and time that your event starts.
                </p>
              </div>

              {/* Event End Date Time */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Event End</Label>
                <DateTimeSelect
                  date={eventData.endDate}
                  setDate={(date) => updateField("endDate", date)}
                  time={eventData.endTime}
                  setTime={(time) => updateField("endTime", time)}
                  enabled={eventDateEnabled}
                  setEnabled={setEventDateEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  The date and time that your event ends.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Venue Details */}
              <div className="space-y-2">
                <Label htmlFor="venue-details" className="text-sm font-medium text-foreground">
                  Venue Details
                </Label>
                <Textarea
                  id="venue-details"
                  className="min-h-[100px] resize-none"
                  value={eventData.venueDetails}
                  onChange={(e) => updateField("venueDetails", e.target.value)}
                  placeholder="Enter venue address, capacity, and other details..."
                />
                <p className="text-xs text-muted-foreground">
                  Details about venue, please include as much detail as possible.
                </p>
              </div>

              {/* Event Sales Start Date Time */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Event Sales Start</Label>
                <DateTimeSelect
                  date={eventData.salesStartDate}
                  setDate={(date) => updateField("salesStartDate", date)}
                  time={eventData.salesStartTime}
                  setTime={(time) => updateField("salesStartTime", time)}
                  enabled={eventSalesDateEnabled}
                  setEnabled={setEventSalesDateEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  The date and time that tickets are available for purchase.
                </p>
              </div>

              {/* Event Sales End Date Time */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Event Sales End</Label>
                <DateTimeSelect
                  date={eventData.salesEndDate}
                  setDate={(date) => updateField("salesEndDate", date)}
                  time={eventData.salesEndTime}
                  setTime={(time) => updateField("salesEndTime", time)}
                  enabled={eventSalesDateEnabled}
                  setEnabled={setEventSalesDateEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  The date and time that ticket sales end.
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Types Section */}
          <div className="space-y-4">
            <Card className="card-3d overflow-hidden">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex gap-2 items-center text-lg">
                      <Ticket className="w-5 h-5" />
                      Ticket Types
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={() => handleAddTicketType()}
                      className="interactive"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Ticket Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {eventData.ticketTypes.map((ticketType) => {
                    return (
                      <div key={ticketType.id || generateTempId()} className="p-4 bg-card rounded-xl border border-border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-foreground">
                                {ticketType.name}
                              </p>
                              <Badge
                                variant="secondary"
                                className="font-medium"
                              >
                                ${ticketType.price}
                              </Badge>
                            </div>
                            {ticketType.totalAvailable && (
                              <p className="text-sm text-muted-foreground">
                                {ticketType.totalAvailable} tickets available
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTicketType(ticketType)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTicketType(ticketType.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <DialogContent className="card-3d max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {currentTicketType?.id ? "Edit Ticket Type" : "Add Ticket Type"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Please enter details of ticket type
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticket-type-name">Name</Label>
                      <Input
                        id="ticket-type-name"
                        value={currentTicketType?.name}
                        onChange={(e) =>
                          setCurrentTicketType(
                            currentTicketType
                              ? { ...currentTicketType, name: e.target.value }
                              : undefined,
                          )
                        }
                        placeholder="e.g General Admission, VIP, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ticket-type-price">Price</Label>
                        <Input
                          id="ticket-type-price"
                          type="number"
                          value={currentTicketType?.price}
                          onChange={(e) =>
                            setCurrentTicketType(
                              currentTicketType
                                ? {
                                    ...currentTicketType,
                                    price: Number.parseFloat(e.target.value),
                                  }
                                : undefined,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket-type-total-available">
                          Total Available
                        </Label>
                        <Input
                          id="ticket-type-total-available"
                          type="number"
                          value={currentTicketType?.totalAvailable}
                          onChange={(e) =>
                            setCurrentTicketType(
                              currentTicketType
                                ? {
                                    ...currentTicketType,
                                    totalAvailable: Number.parseFloat(e.target.value),
                                  }
                                : undefined,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticket-type-description">Description</Label>
                      <Textarea
                        id="ticket-type-description"
                        value={currentTicketType?.description}
                        onChange={(e) =>
                          setCurrentTicketType(
                            currentTicketType
                              ? {
                                    ...currentTicketType,
                                    description: e.target.value,
                                  }
                                : undefined,
                          )
                        }
                        placeholder="Describe what this ticket includes..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSaveTicketType}
                      className="interactive w-full"
                    >
                      Save Ticket Type
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Event Status</Label>
            <Select
              value={eventData.status}
              onValueChange={(value) => updateField("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Event Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EventStatusEnum.DRAFT}>Draft</SelectItem>
                <SelectItem value={EventStatusEnum.PUBLISHED}>Published</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Please select the status of your event.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="card-3d">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              className="interactive gradient w-full lg:w-auto px-8"
              size="lg"
            >
              {isEditMode ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default DashboardManageEventPage;