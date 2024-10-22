import { orgColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import { useMemo, useState } from "react";
import countryList from "react-select-country-list";
import { toast } from "sonner";
import {
  useCreateAccountMutation,
  useGetAllAccountsQuery,
} from "../../features/api/apiSlice";

const Index = () => {
  const options = useMemo(() => countryList().getData(), []);
  const [showCreateOrgForm, setShowCreateOrgForm] = useState(false);
  const [accountName, SetAccountName] = useState("");
  const [contactFullName, setContactFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [category, setCategory] = useState("");
  const [numberOfLicense, setNumberOfLicense] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("active");
  const [country, setCountry] = useState<(typeof options)[0]>({});

  const [createAccount, { isLoading }] = useCreateAccountMutation();
  const { data, isLoading: gettingAccounts } = useGetAllAccountsQuery();

  const handleSubmit = async () => {
    const payload = {
      accountName,
      contactFullName,
      email,
      role,
      category,
      numberOfLicense,
      licenseStatus,
      country: country.label,
      countryCode: country.value,
    };

    try {
      const response = await createAccount(payload);
      console.log("res", response);

      if (response.error) {
        toast.error("Organisation creation failed", {
          description: response?.error?.data?.message,
        });
      } else {
        toast("Organisation created successfully");
        setShowCreateOrgForm(false);
        // document.getElementById("my-drawer-4").checked = false;
        // setShowToast(true);
        // setTimeout(() => {
        //   setShowToast(false);
        // }, 40000);
      }
    } catch (error) {
      console.error("Error creating account", error);
      toast.error("Organisation creation failed");
    } finally {
      SetAccountName("");
      setContactFullName("");
      setEmail("");
      setRole("");
      setCategory("");
      setNumberOfLicense("");
      setLicenseStatus("");
    }
  };

  return (
    <>
      <Sheet open={showCreateOrgForm} onOpenChange={setShowCreateOrgForm}>
        <SheetTrigger asChild>
          <Button className="float-right w-fit">Create organization</Button>
        </SheetTrigger>
        <SheetContent className="sm:w-[540px] overflow-auto">
          <SheetHeader>
            <SheetTitle>Create organization</SheetTitle>
            {/* <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription> */}
          </SheetHeader>
          <div className="overflow-auto">
            <div className="">
              <div className="mt-4">
                <div className="text-md font-sm py-2">Organization name</div>
                <input
                  value={accountName}
                  onChange={(e) => SetAccountName(e.target.value)}
                  type="text"
                  placeholder="Organization name"
                  className="input input-bordered w-full min-w-full"
                />
              </div>

              <div className="mt-4">
                <div className="text-md font-sm py-2">
                  Organization Contact Full Name
                </div>
                <input
                  value={contactFullName}
                  onChange={(e) => setContactFullName(e.target.value)}
                  type="text"
                  placeholder="Organization contact full Name"
                  className="input input-bordered w-full min-w-full"
                />
              </div>

              <div className="mt-4">
                <div className="text-md font-sm py-2">
                  Organization Contact Email
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Organization contact email"
                  className="input input-bordered w-full min-w-full"
                />
              </div>

              <div className="mt-4">
                <div className="text-md font-sm py-2">
                  Organization Category
                </div>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="select select-bordered w-full min-w-full"
                >
                  <option disabled selected>
                    Select Organization Category
                  </option>
                  <option value="College">College</option>
                  <option value="High School">High School</option>
                  <option value="High School">Primary School</option>
                  <option value="University">University</option>
                </select>
              </div>

              <div className="mt-4">
                <div className="text-md font-sm py-2">Number of License</div>
                <input
                  value={numberOfLicense}
                  onChange={(e) => setNumberOfLicense(e.target.value)}
                  type="number"
                  placeholder="Number of license"
                  className="input input-bordered w-full min-w-full"
                />
              </div>

              <div className="mt-4">
                <div className="text-md font-sm py-2">Counrtry</div>
                <select
                  onChange={(e) =>
                    setCountry(
                      options.find((country) => country.value == e.target.value)
                    )
                  }
                  className="select select-bordered w-full min-w-full"
                >
                  {options.map((val) => (
                    <option value={val.value} key={val.value}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                disabled={isLoading}
                className="w-full mt-4"
                onClick={handleSubmit}
              >
                {isLoading && (
                  <span className="mr-2 animate-spin">
                    <Loader />
                  </span>
                )}
                Create Organization
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <DataTable
        columns={orgColumns}
        data={data || []}
        isLoading={gettingAccounts}
      />
    </>
  );
};

export default Index;
