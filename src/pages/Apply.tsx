import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Apply = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    loanType: "",
    city: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, loanType: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({ title: "Please enter your full name", variant: "destructive" });
      return false;
    }
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      toast({ title: "Please enter a valid 10-digit mobile number", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return false;
    }
    if (!formData.loanType) {
      toast({ title: "Please select a loan type", variant: "destructive" });
      return false;
    }
    if (!formData.city.trim()) {
      toast({ title: "Please enter your city", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Using FormSubmit.co for no-backend email submission
      // Replace 'YOUR_EMAIL@example.com' with the owner's actual email
      const response = await fetch("https://formsubmit.co/ajax/YOUR_EMAIL@example.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          "Full Name": formData.fullName,
          "Mobile Number": formData.mobile,
          "Email": formData.email,
          "Loan Type": formData.loanType,
          "City": formData.city,
          "Message": formData.message || "No additional message",
          "_subject": `New Loan Application: ${formData.loanType}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="section-padding">
        <div className="section-container">
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Thank You!
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Your details have been sent successfully. Our team will review your 
              application and contact you shortly. We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="section-container">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Apply for a Loan
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Fill in your details below and our team will get in touch with you 
            to discuss your loan requirements.
          </p>
        </div>

        {/* Application Form */}
        <div className="mx-auto max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={10}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    maxLength={255}
                  />
                </div>

                {/* Loan Type */}
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type *</Label>
                  <Select onValueChange={handleSelectChange} value={formData.loanType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Home Loan">Home Loan</SelectItem>
                      <SelectItem value="Business Loan">Business Loan</SelectItem>
                      <SelectItem value="Education Loan">Education Loan</SelectItem>
                      <SelectItem value="Vehicle Loan">Vehicle Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message / Requirement (Optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Any additional details about your loan requirement..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={1000}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree to be contacted regarding your loan application.
              Your information is kept confidential.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
