import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AlumniSettings() {
  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Full Name</label>
            <Input placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="flex justify-end">
            <Button className="bg-fusteps-red text-white hover:bg-red-600">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


