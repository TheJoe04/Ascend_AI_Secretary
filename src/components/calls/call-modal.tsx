"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  Loader2, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Play,
  Square
} from "lucide-react";

interface CallResult {
  number: string;
  conversation_id: string;
  status: string;
  duration?: number;
  transcript?: any[];
  summary?: any;
  success: boolean;
  error?: string;
}

interface CallModalProps {
  onCallComplete: (results: CallResult[]) => void;
}

export function CallModal({ onCallComplete }: CallModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [startMessage, setStartMessage] = useState("Hello, this is Ascend. I wanted to reach out about our new product demo.");
  const [isCalling, setIsCalling] = useState(false);
  const [callResults, setCallResults] = useState<CallResult[]>([]);
  const [currentCall, setCurrentCall] = useState<string | null>(null);

  const handleStartCalls = async () => {
    if (!phoneNumbers.trim()) {
      alert("Please enter at least one phone number");
      return;
    }

    setIsCalling(true);
    setCallResults([]);
    setCurrentCall(phoneNumbers.split('\n')[0].trim());

    try {
      const response = await fetch('/api/calls/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumbers,
          startMessage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCallResults(data.results);
        onCallComplete(data.results);
        setIsOpen(false);
      } else {
        alert(`Call failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Call error:', error);
      alert('Failed to start calls. Please try again.');
    } finally {
      setIsCalling(false);
      setCurrentCall(null);
    }
  };

  const getStatusIcon = (status: string, success: boolean) => {
    if (success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === "failed") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string, success: boolean) => {
    if (success) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>;
    } else if (status === "failed") {
      return <Badge variant="destructive">Failed</Badge>;
    } else {
      return <Badge variant="secondary">In Progress</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PhoneCall className="h-4 w-4 mr-2" />
          Start a Call
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            AI Call Configuration
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Phone Numbers Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Phone Numbers</label>
            <textarea 
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="Enter phone numbers (one per line):&#10;+15593289806&#10;+18312871621"
              className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter one phone number per line. Format: +1XXXXXXXXXX
            </p>
          </div>
          
          {/* Opening Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">Opening Message</label>
            <Input 
              value={startMessage}
              onChange={(e) => setStartMessage(e.target.value)}
              placeholder="Hello, this is Ascend. I wanted to reach out about our new product demo."
              className="w-full"
            />
          </div>

          {/* Current Call Status */}
          {isCalling && currentCall && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <div>
                    <p className="font-medium">Calling {currentCall}</p>
                    <p className="text-sm text-muted-foreground">Please wait while we connect...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call Results */}
          {callResults.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Call Results</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {callResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status, result.success)}
                      <div>
                        <p className="font-medium">{result.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.duration ? `Duration: ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : 'No duration'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(result.status, result.success)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleStartCalls}
              disabled={isCalling || !phoneNumbers.trim()}
              className="flex-1"
            >
              {isCalling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Calling...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Calls
                </>
              )}
            </Button>
            <Button 
              onClick={() => setIsOpen(false)}
              variant="outline"
              disabled={isCalling}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
