"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

export interface RssFeed {
  url: string;
  username?: string;
  password?: string;
  countStart?: number;
  countIncrement?: number;
  customHeaders?: Record<string, string>;
}

interface RssFeedsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rssFeeds: RssFeed[];
  onSave: (feeds: RssFeed[]) => void;
}

export function RssFeedsModal({
  open,
  onOpenChange,
  rssFeeds,
  onSave,
}: RssFeedsModalProps) {
  const [feeds, setFeeds] = useState<RssFeed[]>(rssFeeds);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFeed, setNewFeed] = useState<{
    url: string;
    username: string;
    password: string;
    countStart: string;
    countIncrement: string;
    key1: string;
    value1: string;
    key2: string;
    value2: string;
    key3: string;
    value3: string;
  }>({
    url: "",
    username: "",
    password: "",
    countStart: "",
    countIncrement: "",
    key1: "",
    value1: "",
    key2: "",
    value2: "",
    key3: "",
    value3: "",
  });

  const handleAddFeed = () => {
    if (!newFeed.url.trim()) {
      alert("RSS Feed URL is required");
      return;
    }

    // Build custom headers object
    const customHeaders: Record<string, string> = {};
    if (newFeed.key1 && newFeed.value1) {
      customHeaders[newFeed.key1] = newFeed.value1;
    }
    if (newFeed.key2 && newFeed.value2) {
      customHeaders[newFeed.key2] = newFeed.value2;
    }
    if (newFeed.key3 && newFeed.value3) {
      customHeaders[newFeed.key3] = newFeed.value3;
    }

    const feed: RssFeed = {
      url: newFeed.url.trim(),
      username: newFeed.username.trim() || undefined,
      password: newFeed.password.trim() || undefined,
      countStart: newFeed.countStart ? parseInt(newFeed.countStart) : undefined,
      countIncrement: newFeed.countIncrement
        ? parseInt(newFeed.countIncrement)
        : undefined,
      customHeaders:
        Object.keys(customHeaders).length > 0 ? customHeaders : undefined,
    };

    if (editingIndex !== null) {
      // Update existing feed
      const updatedFeeds = [...feeds];
      updatedFeeds[editingIndex] = feed;
      setFeeds(updatedFeeds);
      setEditingIndex(null);
    } else {
      // Add new feed
      setFeeds([...feeds, feed]);
    }

    // Clear form
    setNewFeed({
      url: "",
      username: "",
      password: "",
      countStart: "",
      countIncrement: "",
      key1: "",
      value1: "",
      key2: "",
      value2: "",
      key3: "",
      value3: "",
    });
  };

  const handleEditFeed = (index: number) => {
    const feed = feeds[index];
    setEditingIndex(index);

    // Extract custom headers
    const headers = feed.customHeaders || {};
    const headerKeys = Object.keys(headers);

    setNewFeed({
      url: feed.url,
      username: feed.username || "",
      password: feed.password || "",
      countStart: feed.countStart?.toString() || "",
      countIncrement: feed.countIncrement?.toString() || "",
      key1: headerKeys[0] || "",
      value1: headerKeys[0] ? headers[headerKeys[0]] : "",
      key2: headerKeys[1] || "",
      value2: headerKeys[1] ? headers[headerKeys[1]] : "",
      key3: headerKeys[2] || "",
      value3: headerKeys[2] ? headers[headerKeys[2]] : "",
    });
  };

  const handleSave = () => {
    onSave(feeds);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFeeds(rssFeeds);
    setEditingIndex(null);
    setNewFeed({
      url: "",
      username: "",
      password: "",
      countStart: "",
      countIncrement: "",
      key1: "",
      value1: "",
      key2: "",
      value2: "",
      key3: "",
      value3: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage RSS Feeds</DialogTitle>
          <DialogDescription>
            Add and manage multiple RSS feeds with authentication and custom
            headers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New RSS Feed Form */}
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold">
              {editingIndex !== null ? "Edit RSS Feed" : "Add New RSS Feed"}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="feed-url">RSS Feed URL *</Label>
              <Input
                id="feed-url"
                type="url"
                placeholder="https://example.com/feed.rss"
                value={newFeed.url}
                onChange={(e) =>
                  setNewFeed({ ...newFeed, url: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username (Optional)</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username for protected feeds"
                  value={newFeed.username}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, username: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password for protected feeds"
                  value={newFeed.password}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count-start">Count Start (Optional)</Label>
                <Input
                  id="count-start"
                  type="number"
                  placeholder="0"
                  value={newFeed.countStart}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, countStart: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="count-increment">
                  Count Increment (Optional)
                </Label>
                <Input
                  id="count-increment"
                  type="number"
                  placeholder="1"
                  value={newFeed.countIncrement}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, countIncrement: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Custom Headers (Optional)</Label>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Key 1"
                  value={newFeed.key1}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, key1: e.target.value })
                  }
                />
                <Input
                  placeholder="Value 1"
                  value={newFeed.value1}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, value1: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Key 2"
                  value={newFeed.key2}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, key2: e.target.value })
                  }
                />
                <Input
                  placeholder="Value 2"
                  value={newFeed.value2}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, value2: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Key 3"
                  value={newFeed.key3}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, key3: e.target.value })
                  }
                />
                <Input
                  placeholder="Value 3"
                  value={newFeed.value3}
                  onChange={(e) =>
                    setNewFeed({ ...newFeed, value3: e.target.value })
                  }
                />
              </div>
            </div>

            <Button onClick={handleAddFeed} className="w-full">
              {editingIndex !== null ? "Update RSS Feed" : "Add RSS Feed"}
            </Button>
          </div>

          {/* RSS Feeds List */}
          {feeds.length > 0 && (
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="font-semibold">RSS Feeds ({feeds.length})</h3>

              <div className="space-y-2">
                {feeds.map((feed, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {feed.url}
                      </p>
                      {(feed.username ||
                        feed.countStart !== undefined ||
                        feed.customHeaders) && (
                        <p className="text-xs text-muted-foreground">
                          {feed.username && `User: ${feed.username}`}
                          {feed.countStart !== undefined &&
                            ` • Start: ${feed.countStart}`}
                          {feed.customHeaders &&
                            ` • ${Object.keys(feed.customHeaders).length} headers`}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditFeed(index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
