"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Building, Check, Loader2, Plus } from "lucide-react";
import { OrgItems } from "@/types/organizationTypes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const SelectOrgPage = () => {
  const router = useRouter();
  const { data: session, isPending: isUserLoading } = authClient.useSession();
  const { data: organizations, isPending: isOrgsLoading } =
    authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const [orgName, setOrgName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [switchingOrgId, setSwitchingOrdId] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);

  const user = session?.user?.name ?? "Guest";
  const orgList = organizations ?? [];

  //   const { data, error } = authClient.organization.create({
  //     name: "My Org",
  //     slug: "my-org",
  //   });

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleCreateOrg = async () => {
    if (!orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }
    setIsCreating(true);
    setError(null);

    const slug = generateSlug(orgName);

    const { data, error: createError } = await authClient.organization.create({
      name: orgName.trim(),
      slug,
    });
    if (createError || !data) {
      setError(createError?.message ?? "failed to create organization");
      setIsCreating(false);
      return;
    }
    // active the newly created organization
    await authClient.organization.setActive({ organizationId: data.id });

    setOrgName("");
    setIsCreating(false);
    router.push(`/${data.slug}`);
    router.refresh();
  };

  const handleSelectOrg = async (org: OrgItems) => {
    setSwitchingOrdId(org.id);
    setError(null);
    const { error: switchError } = await authClient.organization.setActive({
      organizationId: org.id,
    });

    if (switchError) {
      setError(switchError?.message ?? "Failed to switch organization");
      setSwitchingOrdId(null);
      return;
    }
    router.push(`/${org.slug}`);
    router.refresh();
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome, {user}!</h1>
        <p className="text-gray-600">Select or Create Organziation </p>
      </div>
      {/* create organization */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 " />
            </CardTitle>
            <CardDescription>
              Start a new workspace for your team
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={isCreating}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleCreateOrg()}
              />
              <Button
                onClick={handleCreateOrg}
                disabled={isCreating || !orgName.trim()}
                className="min-w-25"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Your organizations ({orgList.length})
          </CardTitle>
          <CardDescription>
            {orgList.length === 0
              ? "Create your first organization above to get started"
              : "Choose a workspace to open its dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOrgsLoading ? (
            <div className="flex items-center justify-center py-8 text-sm ">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading organizations...
            </div>
          ) : orgList.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text center text-sm">
              You have not joined or created any organization yet
            </div>
          ) : (
            <div className="space-y-3">
              {orgList.map((org) => {
                const isActive = activeOrg?.id == org.id;
                const isSwitching = switchingOrgId === org.id;
                return (
                  <div
                    key={org.id}
                    className="flex items-center justify-between rounded-lg border "
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{org.name}</p>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 rounded-full">
                            <Check className="h-3 w-3" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        /{org.slug}
                      </p>
                    </div>
                    <Button
                      variant={isActive ? "secondary" : "default"}
                      size="sm"
                      disabled={isSwitching}
                      onClick={() => handleSelectOrg(org)}
                    >
                      {isSwitching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>{isActive ? "Open" : "Swtich"}</>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectOrgPage;
