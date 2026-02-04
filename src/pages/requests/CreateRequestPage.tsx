import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Server, Key, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type RequestTypeOption = 'signup' | 'system-creation' | 'system-permission';

const requestTypes: {
  type: RequestTypeOption;
  title: string;
  description: string;
  icon: React.ElementType;
  approvedBy: string;
}[] = [
  {
    type: 'signup',
    title: 'Sign-up Request',
    description: 'Request PM or Developer role to access the platform',
    icon: UserPlus,
    approvedBy: 'Platform Admin',
  },
  {
    type: 'system-creation',
    title: 'System Creation Request',
    description: 'Register a new system in the catalog',
    icon: Server,
    approvedBy: 'Platform Admin',
  },
  {
    type: 'system-permission',
    title: 'System Permission Request',
    description: 'Request access to a specific system',
    icon: Key,
    approvedBy: 'System PM',
  },
];

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<RequestTypeOption | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/requests/create/${selectedType}`);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Create Request"
        description="Select the type of request you want to submit"
      />

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {requestTypes.map((rt) => {
          const Icon = rt.icon;
          const isSelected = selectedType === rt.type;

          return (
            <Card
              key={rt.type}
              className={cn(
                'cursor-pointer transition-all hover:border-accent hover:shadow-md',
                isSelected && 'border-accent ring-2 ring-accent/20'
              )}
              onClick={() => setSelectedType(rt.type)}
            >
              <CardHeader>
                <div
                  className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center mb-2',
                    isSelected ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{rt.title}</CardTitle>
                <CardDescription>{rt.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Approved by:</span> {rt.approvedBy}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleContinue} disabled={!selectedType}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
