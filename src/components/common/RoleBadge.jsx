import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, User } from 'lucide-react';

export default function RoleBadge({ role }) {
  if (role === "대표자") {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
        <Shield className="w-3 h-3" />
        대표자
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="gap-1">
      <User className="w-3 h-3" />
      입주자
    </Badge>
  );
}