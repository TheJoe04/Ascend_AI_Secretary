"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { CallTranscriptModal } from "@/components/calls/call-transcript-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/shared/status-pill";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCallsApi } from "@/lib/hooks/use-calls-api";
import { Call, FilterOptions, PaginationOptions } from "@/lib/types";
import { formatDateTime, formatDuration, formatRelativeTime } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  Phone, 
  PhoneMissed, 
  Voicemail,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download
} from "lucide-react";

export default function CallsPage() {
  const { list, isLoading, error } = useCallsApi();
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const loadCalls = useCallback(async () => {
    try {
      const filters: FilterOptions = {
        search: search || undefined,
        status: statusFilter !== "all" ? [statusFilter as any] : undefined,
        sentiment: sentimentFilter !== "all" ? [sentimentFilter as any] : undefined,
      };

      const pagination: PaginationOptions = {
        page: currentPage,
        limit: pageSize,
        sortBy: "timestamp",
        sortOrder: "desc",
      };

      const response = await list(filters, pagination);
      setCalls(response.data);
      setTotalItems(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
    } catch (err) {
      console.error("Failed to load calls:", err);
    }
  }, [search, statusFilter, sentimentFilter, currentPage, list]);

  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  const handleViewCall = (call: Call) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'missed':
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      case 'voicemail':
        return <Voicemail className="h-4 w-4 text-yellow-500" />;
      default:
        return <Phone className="h-4 w-4 text-gray-500" />;
    }
  };

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
    <div className="space-y-6">
      <PageHeader 
        title="Calls" 
        description="Manage and review all phone calls"
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search calls..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calls Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caller</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading calls...
                    </TableCell>
                  </TableRow>
                ) : calls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No calls found
                    </TableCell>
                  </TableRow>
                ) : (
                  calls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">
                        {call.callerName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {call.callerNumber}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getStatusIcon(call.status)}
                        {formatDuration(call.duration)}
                      </TableCell>
                      <TableCell>
                        <StatusPill status={getStatusColor(call.status) as any}>
                          {call.status}
                        </StatusPill>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={getSentimentColor(call.sentiment) as any}>
                          {call.sentiment}
                        </StatusPill>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatRelativeTime(call.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {call.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {call.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{call.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCall(call)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {call.recordingUrl && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} calls
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Transcript Modal */}
      <CallTranscriptModal
        call={selectedCall}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCall(null);
        }}
      />
    </div>
  );
}

