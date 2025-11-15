import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmployerSettings() {
  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Company Name</label>
            <Input placeholder="Your company name" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Contact Email</label>
            <Input type="email" placeholder="hr@company.com" />
          </div>
          <div className="flex justify-end">
            <Button className="bg-fusteps-red text-white hover:bg-red-600">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


