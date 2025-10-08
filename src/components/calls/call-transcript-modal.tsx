"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/shared/status-pill";
import { Call } from "@/lib/types";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { Phone, Clock, User, MessageSquare, Download } from "lucide-react";

interface CallTranscriptModalProps {
  call: Call | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CallTranscriptModal({ call, isOpen, onClose }: CallTranscriptModalProps) {
  if (!call) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'success';
      case 'missed':
        return 'error';
      case 'voicemail':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Call Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Call Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Call Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Caller:</span>
                  <span>{call.callerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Number:</span>
                  <span>{call.callerNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Duration:</span>
                  <span>{formatDuration(call.duration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Time:</span>
                  <span>{formatDateTime(call.timestamp)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <StatusPill status={getStatusColor(call.status) as any}>
                    {call.status}
                  </StatusPill>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Sentiment:</span>
                  <StatusPill status={getSentimentColor(call.sentiment) as any}>
                    {call.sentiment}
                  </StatusPill>
                </div>
              </div>

              {call.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {call.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transcript */}
          {call.transcript && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {call.transcript}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {call.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">
                    {call.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            {call.recordingUrl && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

