import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTable } from "@/components/table/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Loader, Plus, Users, Mail, Phone, CheckCircle, XCircle, Clock, MoreVertical, UserCheck, UserX, MailPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateAgentMutation, useGetAllAgentsQuery, useUpdateAgentStatusMutation, useResendAgentInvitationMutation, useDeleteAgentMutation } from "../../features/api/apiSlice";

const AgentManagement = () => {
  const [showCreateAgentForm, setShowCreateAgentForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [createAgent, { isLoading }] = useCreateAgentMutation();
  const { data: agents, isLoading: loadingAgents } = useGetAllAgentsQuery();
  const [updateAgentStatus, { isLoading: updatingStatus }] = useUpdateAgentStatusMutation();
  const [resendInvitation, { isLoading: resendingInvitation }] = useResendAgentInvitationMutation();
  const [deleteAgent, { isLoading: deletingAgent }] = useDeleteAgentMutation();

  // Action handlers
  const handleToggleStatus = async (agent) => {
    try {
      const newStatus = !agent.isActive;
      const response = await updateAgentStatus({
        agentId: agent._id,
        isActive: newStatus
      });

      if (response.error) {
        toast.error("Failed to update agent status", {
          description: response.error.data?.message || "Something went wrong",
        });
      } else {
        toast.success(`Agent ${newStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      toast.error("Failed to update agent status");
    }
  };

  const handleResendInvitation = async (agent) => {
    try {
      const response = await resendInvitation(agent._id);

      if (response.error) {
        toast.error("Failed to resend invitation", {
          description: response.error.data?.message || "Something went wrong",
        });
      } else {
        toast.success("Invitation email resent successfully");
      }
    } catch (error) {
      toast.error("Failed to resend invitation");
    }
  };

  const handleDeleteAgent = async (agent) => {
    if (confirm(`Are you sure you want to delete agent "${agent.fullName}"? This action cannot be undone.`)) {
      try {
        const response = await deleteAgent(agent._id);

        if (response.error) {
          toast.error("Failed to delete agent", {
            description: response.error.data?.message || "Something went wrong",
          });
        } else {
          toast.success("Agent deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete agent");
      }
    }
  };

  // Define columns for the agents table
  const agentColumns = [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.getValue("fullName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{row.getValue("phoneNumber")}</span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        const isEmailVerified = row.original.isEmailVerified;
        
        if (isActive && isEmailVerified) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3" />
              Active
            </span>
          );
        } else if (!isEmailVerified) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3" />
              Pending Setup
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <XCircle className="h-3 w-3" />
              Inactive
            </span>
          );
        }
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <span className="text-sm text-gray-600">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const agent = row.original;
        const isLoading = updatingStatus || resendingInvitation || deletingAgent;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleToggleStatus(agent)}
                disabled={isLoading}
              >
                {agent.isActive ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate Agent
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate Agent
                  </>
                )}
              </DropdownMenuItem>
              
              {!agent.isEmailVerified && (
                <DropdownMenuItem
                  onClick={() => handleResendInvitation(agent)}
                  disabled={isLoading}
                >
                  <MailPlus className="mr-2 h-4 w-4" />
                  Resend Invitation
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => handleDeleteAgent(agent)}
                disabled={isLoading}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    // Validate required fields
    if (!fullName || !phoneNumber || !email) {
      toast.error("All fields are required", {
        description: "Please fill in all the required fields",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", {
        description: "Please enter a valid email address",
      });
      return;
    }

    // Validate phone number (basic validation)
    if (phoneNumber.length < 10) {
      toast.error("Invalid phone number", {
        description: "Please enter a valid phone number",
      });
      return;
    }

    const payload = {
      fullName,
      phoneNumber,
      email,
    };

    try {
      const response = await createAgent(payload);
      console.log("Agent creation response:", response);

      if (response.error) {
        toast.error("Agent creation failed", {
          description: response?.error?.data?.message || "Something went wrong",
        });
      } else {
        toast.success("Agent created successfully", {
          description: "An invitation email has been sent to the agent",
        });
        setShowCreateAgentForm(false);
        // Clear form
        setFullName("");
        setPhoneNumber("");
        setEmail("");
        // The list will automatically refresh due to RTK Query cache invalidation
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Agent creation failed", {
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="py-10 px-7">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage agents for your platform
          </p>
        </div>
        
        <Sheet open={showCreateAgentForm} onOpenChange={setShowCreateAgentForm}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:w-[540px] overflow-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Create New Agent
              </SheetTitle>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  How it works:
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Enter the agent's basic information</li>
                  <li>• An invitation email will be sent to the agent</li>
                  <li>• The agent will receive a secure link to complete their signup</li>
                  <li>• Once they set their password, they can access the platform</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    placeholder="Enter agent's full name"
                    className="input input-bordered w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter agent's email address"
                    className="input input-bordered w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                    placeholder="Enter agent's phone number"
                    className="input input-bordered w-full"
                    disabled={isLoading}
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    Agent Role & Permissions
                  </h4>
                  <p className="text-xs text-gray-600">
                    The new agent will be created with the <strong>"agent"</strong> role
                    and will have access to agent-specific features and permissions.
                  </p>
                </div>

                <Button
                  disabled={isLoading}
                  className="w-full"
                  onClick={handleSubmit}
                >
                  {isLoading && (
                    <span className="mr-2 animate-spin">
                      <Loader className="h-4 w-4" />
                    </span>
                  )}
                  Create Agent & Send Invitation
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Agent List Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Current Agents</h2>
            {agents?.data && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {agents.count || 0}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <DataTable
            columns={agentColumns}
            data={agents?.data || []}
            isLoading={loadingAgents}
          />
        </div>
      </div>

      {/* Instructions Card */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Agent Creation Process
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-medium text-blue-800 mb-2">1. Create Agent</div>
            <p className="text-blue-700">
              Enter the agent's basic information and click create
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-medium text-blue-800 mb-2">2. Email Sent</div>
            <p className="text-blue-700">
              Agent receives an invitation email with a secure signup link
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-medium text-blue-800 mb-2">3. Agent Signup</div>
            <p className="text-blue-700">
              Agent sets their password and can start using the platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;
