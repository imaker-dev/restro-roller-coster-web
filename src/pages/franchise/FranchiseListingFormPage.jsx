import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import { MultiSelectDropdownField } from "../../components/fields/MultiSelectDropdownField";
import {
  Building2,
  Image,
  Loader2,
  MapPin,
  Save,
  Tags,
  Wallet,
  TrendingUp,
  Users,
  HeadphonesIcon,
  Globe,
  Mail,
  Phone,
  Percent,
  Calendar,
  Ruler,
  Store,
  IndianRupee,
  Pencil,
} from "lucide-react";
import AccordionSection from "../../components/AccordionSection";
import DragDropUploader from "../../components/DragDropUploader";
import ToggleField from "../../components/fields/ToggleField";
import InfoCard from "../../components/InfoCard";
import ModalAction from "../../components/ModalAction";
import { useNavigate } from "react-router-dom";
import { MultiSelectField } from "../../components/fields/MultiSelectField";
import { handleResponse } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  createFranchise,
  updateFranchise,
  fetchFranchiseById,
} from "../../redux/slices/franchiseListingSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import LoadingOverlay from "../../components/LoadingOverlay";

const SUPPORT_OPTIONS = [
  { id: "site_selection", label: "Site Selection" },
  { id: "store_design", label: "Store Design" },
  { id: "training", label: "Training" },
  { id: "marketing", label: "Marketing Support" },
  { id: "operations", label: "Operations Manual" },
  { id: "supply_chain", label: "Supply Chain" },
  { id: "it_support", label: "IT Support" },
  { id: "ongoing_support", label: "Ongoing Support" },
];

const TAG_OPTIONS = [
  { id: "fast_growing", label: "Fast Growing" },
  { id: "trending", label: "Trending" },
  { id: "low_investment", label: "Low Investment" },
  { id: "high_roi", label: "High ROI" },
  { id: "premium", label: "Premium" },
  { id: "new_launch", label: "New Launch" },
  { id: "popular", label: "Popular" },
  { id: "award_winning", label: "Award Winning" },
];

const CATEGORY_OPTIONS = [
  { value: "cafe", label: "Cafe" },
  { value: "restaurant", label: "Restaurant" },
  { value: "bakery", label: "Bakery" },
  { value: "fast_food", label: "Fast Food" },
  { value: "fine_dining", label: "Fine Dining" },
  { value: "cloud_kitchen", label: "Cloud Kitchen" },
  { value: "food_truck", label: "Food Truck" },
  { value: "ice_cream", label: "Ice Cream" },
  { value: "beverage", label: "Beverage" },
  { value: "dessert", label: "Dessert" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
];

const FranchiseListingFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { franchiseId } = useQueryParams();
  const {
    isFetchingFranchise,
    franchiseDetails,
    isCreatingFranchise,
    isUpdatingFranchise,
  } = useSelector((state) => state.franchise);

  const isEditMode = Boolean(franchiseId);

  useEffect(() => {
    if (franchiseId) {
      dispatch(fetchFranchiseById(franchiseId));
    }
  }, [franchiseId]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const initialValues = {
    name: "",
    slug: "",
    category: "",
    description: "",
    short_description: "",
    logo_url: [],
    cover_image_url: [],
    gallery_images: [],
    investment_min: "",
    investment_max: "",
    franchise_fee: "",
    working_capital: "",
    monthly_revenue: "",
    expected_roi: "",
    break_even_months: "",
    outlets_live: "",
    established_year: "",
    space_requirement: "",
    staff_required: "",
    tags: [],
    support_offered: [],
    location_city: "",
    location_state: "",
    locations_available: [],
    contact_email: "",
    contact_phone: "",
    website: "",
    is_featured: false,
    status: "pending",
  };

  // Transform franchise details for form when in edit mode
  const getFormInitialValues = () => {
    if (!isEditMode || !franchiseDetails) return initialValues;

    return {
      name: franchiseDetails.name || "",
      slug: franchiseDetails.slug || "",
      category: franchiseDetails.category || "",
      description: franchiseDetails.description || "",
      short_description: franchiseDetails.short_description || "",
      logo_url: franchiseDetails.logo_url ? [franchiseDetails.logo_url] : [],
      cover_image_url: franchiseDetails.cover_image_url
        ? [franchiseDetails.cover_image_url]
        : [],
      gallery_images: franchiseDetails.gallery_images || [],
      investment_min: franchiseDetails.investment_min
        ? parseFloat(franchiseDetails.investment_min)
        : "",
      investment_max: franchiseDetails.investment_max
        ? parseFloat(franchiseDetails.investment_max)
        : "",
      franchise_fee: franchiseDetails.franchise_fee
        ? parseFloat(franchiseDetails.franchise_fee)
        : "",
      working_capital: franchiseDetails.working_capital
        ? parseFloat(franchiseDetails.working_capital)
        : "",
      monthly_revenue: franchiseDetails.monthly_revenue
        ? parseFloat(franchiseDetails.monthly_revenue)
        : "",
      expected_roi: franchiseDetails.expected_roi
        ? parseFloat(franchiseDetails.expected_roi)
        : "",
      break_even_months: franchiseDetails.break_even_months || "",
      outlets_live: franchiseDetails.outlets_live || "",
      established_year: franchiseDetails.established_year || "",
      space_requirement: franchiseDetails.space_requirement || "",
      staff_required: franchiseDetails.staff_required || "",
      tags: franchiseDetails.tags || [],
      support_offered: franchiseDetails.support_offered || [],
      location_city: franchiseDetails.location_city || "",
      location_state: franchiseDetails.location_state || "",
      locations_available: franchiseDetails.locations_available || [],
      contact_email: franchiseDetails.contact_email || "",
      contact_phone: franchiseDetails.contact_phone || "",
      website: franchiseDetails.website || "",
      is_featured: Boolean(franchiseDetails.is_featured),
      status: franchiseDetails.status || "pending",
    };
  };

  const validationSchema = Yup.object({
    // Basic Information
    name: Yup.string()
      .required("Franchise name is required")
      .max(200, "Name too long"),
    slug: Yup.string()
      .max(200, "Slug too long")
      .matches(
        /^[a-z0-9-]*$/,
        "Only lowercase letters, numbers and hyphens allowed",
      ),
    category: Yup.string().required("Category is required"),
    description: Yup.string()
      .required("Full description is required")
      .max(5000, "Description too long"),
    short_description: Yup.string()
      .required("Short description is required")
      .max(500, "Short description too long"),

    // Investment & Financials
    investment_min: Yup.number()
      .typeError("Must be a valid number")
      .required("Minimum investment is required")
      .min(0, "Must be >= 0"),
    investment_max: Yup.number()
      .typeError("Must be a valid number")
      .required("Maximum investment is required")
      .min(0, "Must be >= 0")
      .test(
        "is-greater-than-min",
        "Max investment must be greater than min investment",
        function (value) {
          const { investment_min } = this.parent;
          if (!investment_min || !value) return true;
          return Number(value) >= Number(investment_min);
        },
      ),
    franchise_fee: Yup.number()
      .typeError("Must be a valid number")
      .required("Franchise fee is required")
      .min(0, "Must be >= 0"),
    working_capital: Yup.number()
      .typeError("Must be a valid number")
      .required("Working capital is required")
      .min(0, "Must be >= 0"),
    monthly_revenue: Yup.number()
      .typeError("Must be a valid number")
      .required("Monthly revenue is required")
      .min(0, "Must be >= 0"),
    expected_roi: Yup.number()
      .typeError("Must be a valid number")
      .required("Expected ROI is required")
      .min(0, "Must be >= 0")
      .max(100, "Must be <= 100"),
    break_even_months: Yup.number()
      .typeError("Must be a valid number")
      .required("Break-even period is required")
      .integer("Must be whole number")
      .min(1, "Must be at least 1 month"),
    outlets_live: Yup.number()
      .typeError("Must be a valid number")
      .required("Number of live outlets is required")
      .integer("Must be whole number")
      .min(0, "Must be >= 0"),

    // Operations & Requirements
    established_year: Yup.number()
      .typeError("Must be a valid number")
      .required("Established year is required")
      .integer("Must be whole number")
      .min(1800, "Invalid year")
      .max(new Date().getFullYear(), "Cannot be in future"),
    space_requirement: Yup.string()
      .required("Space requirement is required")
      .max(100, "Too long"),
    staff_required: Yup.number()
      .typeError("Must be a valid number")
      .required("Staff count is required")
      .integer("Must be whole number")
      .min(1, "Must be at least 1"),
    support_offered: Yup.array()
      .required("At least one support service is required")
      .min(1, "Select at least one support service"),

    // Location
    location_city: Yup.string().required("Primary city is required"),
    location_state: Yup.string().required("Primary state is required"),
    locations_available: Yup.array()
      .required("At least one location is required")
      .min(1, "Add at least one available location"),

    // Contact Information
    contact_email: Yup.string()
      .required("Contact email is required")
      .email("Invalid email address"),
    contact_phone: Yup.string()
      .required("Contact phone is required")
      .matches(/^[0-9+\-\s()]*$/, "Invalid phone number")
      .min(10, "Phone number too short"),
    website: Yup.string()
      .required("Website URL is required")
      .url("Invalid URL format"),

    // Media
    logo_url: Yup.array()
      .required("Logo is required")
      .min(1, "Please upload a logo"),
    cover_image_url: Yup.array()
      .required("Cover image is required")
      .min(1, "Please upload a cover image"),
    gallery_images: Yup.array()
      .required("At least one gallery image is required")
      .min(1, "Upload at least one gallery image")
      .max(10, "Maximum 10 gallery images"),

    status: Yup.string()
      .oneOf(["pending", "active"])
      .required("Status is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        slug: values.slug?.trim() || undefined,
        category: values.category,
        description: values.description?.trim(),
        short_description: values.short_description?.trim(),
        logo_url: values.logo_url?.[0],
        cover_image_url: values.cover_image_url?.[0],
        gallery_images: values.gallery_images,
        investment_min: Number(values.investment_min),
        investment_max: Number(values.investment_max),
        franchise_fee: Number(values.franchise_fee),
        working_capital: Number(values.working_capital),
        monthly_revenue: Number(values.monthly_revenue),
        expected_roi: Number(values.expected_roi),
        break_even_months: Number(values.break_even_months),
        outlets_live: Number(values.outlets_live),
        established_year: Number(values.established_year),
        space_requirement: values.space_requirement.trim(),
        staff_required: Number(values.staff_required),
        tags: values.tags,
        support_offered: values.support_offered,
        location_city: values.location_city.trim(),
        location_state: values.location_state.trim(),
        locations_available: values.locations_available,
        contact_email: values.contact_email.trim(),
        contact_phone: values.contact_phone.trim(),
        website: values.website.trim(),
        is_featured: values.is_featured,
        status: values.status,
      };

      console.log(
        "Submitting:",
        payload,
        "Mode:",
        isEditMode ? "UPDATE" : "CREATE",
      );

      const action = isEditMode
        ? updateFranchise({ id: franchiseId, values: payload })
        : createFranchise(payload);
      await handleResponse(dispatch(action), () => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setConfirmOpen(false);
      setPendingValues(null);
    }
  };

  // Show loading state while fetching franchise details
  if (isEditMode && isFetchingFranchise)
    return <LoadingOverlay text="Loading franchise details..." />;

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={isEditMode ? "Edit Franchise" : "List New Franchise"}
          showBackButton
        />

        <Formik
          initialValues={getFormInitialValues()}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values) => {
            setPendingValues(values);
            setConfirmOpen(true);
          }}
        >
          {(formik) => (
            <Form className="space-y-6" autoComplete="off">
              {/* BASIC INFORMATION */}
              <AccordionSection
                title="Basic Information"
                icon={Building2}
                defaultOpen
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Franchise Name"
                      name="name"
                      placeholder="e.g., Royal Cafe & Bakery"
                      required
                      value={formik.values.name}
                      onChange={(e) => {
                        formik.handleChange(e);
                        if (!slugManuallyEdited && !isEditMode) {
                          const slug = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "");
                          formik.setFieldValue("slug", slug);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && formik.errors.name}
                    />

                    <InputField
                      label="Custom Slug"
                      name="slug"
                      placeholder="royal-cafe-bakery"
                      value={formik.values.slug}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setSlugManuallyEdited(true);
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.slug && formik.errors.slug}
                      helperText="Auto-generated from name. Edit to customize URL"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectField
                      label="Category"
                      name="category"
                      required
                      options={CATEGORY_OPTIONS}
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.category && formik.errors.category}
                    />

                    <SelectField
                      label="Status"
                      name="status"
                      required
                      options={STATUS_OPTIONS}
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.status && formik.errors.status}
                    />

                    <MultiSelectDropdownField
                      label="Tags"
                      name="tags"
                      options={TAG_OPTIONS}
                      value={formik.values.tags}
                      onChange={(v) => formik.setFieldValue("tags", v)}
                      placeholder="Select franchise tags"
                      icon={Tags}
                      helperText="Select tags to help categorize your franchise"
                    />
                  </div>

                  <TextareaField
                    label="Short Description"
                    name="short_description"
                    placeholder="Brief summary for franchise cards (max 500 characters)"
                    required
                    value={formik.values.short_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.short_description &&
                      formik.errors.short_description
                    }
                    rows={3}
                    maxLength={500}
                    showCharCount
                  />

                  <TextareaField
                    label="Full Description"
                    name="description"
                    placeholder="Detailed franchise description, benefits, requirements, etc."
                    required
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description && formik.errors.description
                    }
                    rows={6}
                    maxLength={5000}
                    showCharCount
                  />

                  <ToggleField
                    label="Feature on Homepage"
                    description="Highlight this franchise on the main listings page"
                    checked={formik.values.is_featured}
                    onChange={(value) =>
                      formik.setFieldValue("is_featured", value)
                    }
                    activeColorClass="bg-amber-500"
                  />
                </div>
              </AccordionSection>

              {/* INVESTMENT & FINANCIALS */}
              <AccordionSection
                title="Investment & Financials"
                icon={Wallet}
                defaultOpen
              >
                <div className="space-y-6">
                  <InfoCard
                    type="info"
                    title="Financial Information"
                    description="Provide accurate financial details to help potential franchisees make informed decisions."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField
                      label="Minimum Investment"
                      name="investment_min"
                      type="number"
                      placeholder="0.00"
                      icon={IndianRupee}
                      required
                      value={formik.values.investment_min}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.investment_min &&
                        formik.errors.investment_min
                      }
                      helperText="Minimum total investment required"
                    />

                    <InputField
                      label="Maximum Investment"
                      name="investment_max"
                      type="number"
                      placeholder="0.00"
                      icon={IndianRupee}
                      required
                      value={formik.values.investment_max}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.investment_max &&
                        formik.errors.investment_max
                      }
                      helperText="Maximum total investment required"
                    />

                    <InputField
                      label="Franchise Fee (One-time)"
                      name="franchise_fee"
                      type="number"
                      placeholder="0.00"
                      icon={IndianRupee}
                      required
                      value={formik.values.franchise_fee}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.franchise_fee &&
                        formik.errors.franchise_fee
                      }
                      helperText="One-time franchise license fee"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField
                      label="Working Capital Required"
                      name="working_capital"
                      type="number"
                      placeholder="0.00"
                      icon={IndianRupee}
                      required
                      value={formik.values.working_capital}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.working_capital &&
                        formik.errors.working_capital
                      }
                      helperText="Initial working capital needed"
                    />

                    <InputField
                      label="Expected Monthly Revenue"
                      name="monthly_revenue"
                      type="number"
                      placeholder="0.00"
                      icon={TrendingUp}
                      required
                      value={formik.values.monthly_revenue}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.monthly_revenue &&
                        formik.errors.monthly_revenue
                      }
                      helperText="Average monthly revenue expectation"
                    />

                    <InputField
                      label="Expected ROI (%)"
                      name="expected_roi"
                      type="number"
                      placeholder="25"
                      icon={Percent}
                      required
                      value={formik.values.expected_roi}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.expected_roi &&
                        formik.errors.expected_roi
                      }
                      helperText="Expected return on investment (0-100%)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Break-even Period (Months)"
                      name="break_even_months"
                      type="number"
                      placeholder="18"
                      icon={Calendar}
                      required
                      value={formik.values.break_even_months}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.break_even_months &&
                        formik.errors.break_even_months
                      }
                      helperText="Expected months to break even"
                    />

                    <InputField
                      label="Live Outlets Count"
                      name="outlets_live"
                      type="number"
                      placeholder="50"
                      icon={Store}
                      required
                      value={formik.values.outlets_live}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.outlets_live &&
                        formik.errors.outlets_live
                      }
                      helperText="Current number of operational outlets"
                    />
                  </div>
                </div>
              </AccordionSection>

              {/* OPERATIONS */}
              <AccordionSection
                title="Operations & Requirements"
                icon={Users}
                defaultOpen
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField
                      label="Established Year"
                      name="established_year"
                      type="number"
                      placeholder="2015"
                      icon={Calendar}
                      required
                      value={formik.values.established_year}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.established_year &&
                        formik.errors.established_year
                      }
                      helperText="Year the franchise was founded"
                    />

                    <InputField
                      label="Space Requirement"
                      name="space_requirement"
                      placeholder="800-1200 sq ft"
                      icon={Ruler}
                      required
                      value={formik.values.space_requirement}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.space_requirement &&
                        formik.errors.space_requirement
                      }
                      helperText="e.g., 800-1200 sq ft"
                    />

                    <InputField
                      label="Staff Required"
                      name="staff_required"
                      type="number"
                      placeholder="10"
                      icon={Users}
                      required
                      value={formik.values.staff_required}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.staff_required &&
                        formik.errors.staff_required
                      }
                      helperText="Minimum staff needed to operate"
                    />
                  </div>

                  <MultiSelectDropdownField
                    label="Support Offered"
                    name="support_offered"
                    required
                    options={SUPPORT_OPTIONS}
                    value={formik.values.support_offered}
                    onChange={(v) => formik.setFieldValue("support_offered", v)}
                    placeholder="Select support services provided"
                    icon={HeadphonesIcon}
                    helperText="Select all support services you provide to franchisees"
                    error={
                      formik.touched.support_offered &&
                      formik.errors.support_offered
                    }
                  />
                </div>
              </AccordionSection>

              {/* LOCATION */}
              <AccordionSection
                title="Location Details"
                icon={MapPin}
                defaultOpen
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Primary City"
                      name="location_city"
                      placeholder="Mumbai"
                      icon={MapPin}
                      required
                      value={formik.values.location_city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.location_city &&
                        formik.errors.location_city
                      }
                    />

                    <InputField
                      label="Primary State"
                      name="location_state"
                      placeholder="Maharashtra"
                      icon={MapPin}
                      required
                      value={formik.values.location_state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.location_state &&
                        formik.errors.location_state
                      }
                    />
                  </div>

                  <MultiSelectField
                    label="Available Locations"
                    name="locations_available"
                    required
                    placeholder="Type city or state and press Enter"
                    selectedValues={formik.values.locations_available}
                    onChange={(values) =>
                      formik.setFieldValue("locations_available", values)
                    }
                    onBlur={() =>
                      formik.setFieldTouched("locations_available", true)
                    }
                    error={
                      formik.touched.locations_available &&
                      formik.errors.locations_available
                    }
                    helperText="Add cities or states where franchise is available. Press Enter or comma to add."
                  />
                </div>
              </AccordionSection>

              {/* CONTACT & WEB */}
              <AccordionSection
                title="Contact Information"
                icon={Globe}
                defaultOpen
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Contact Email"
                      name="contact_email"
                      type="email"
                      placeholder="info@franchise.com"
                      icon={Mail}
                      required
                      value={formik.values.contact_email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.contact_email &&
                        formik.errors.contact_email
                      }
                    />

                    <InputField
                      label="Contact Phone"
                      name="contact_phone"
                      placeholder="+91 9876543210"
                      icon={Phone}
                      required
                      value={formik.values.contact_phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.contact_phone &&
                        formik.errors.contact_phone
                      }
                    />
                  </div>

                  <InputField
                    label="Website URL"
                    name="website"
                    placeholder="https://www.franchise.com"
                    icon={Globe}
                    required
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.website && formik.errors.website}
                    helperText="Official franchise website or landing page"
                  />
                </div>
              </AccordionSection>

              {/* MEDIA & IMAGES */}
              <AccordionSection title="Media & Images" icon={Image} defaultOpen>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Logo Image <span className="text-red-500">*</span>
                    </label>
                    <DragDropUploader
                      value={formik.values.logo_url}
                      onChange={(files) => {
                        formik.setFieldValue("logo_url", files);
                        formik.setFieldTouched("logo_url", true);
                      }}
                      multiple={false}
                      accept="image/*"
                      maxFiles={1}
                      enableCrop={true}
                      aspectRatio={1}
                      uploadToServer={true}
                    />
                    {formik.touched.logo_url && formik.errors.logo_url && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.logo_url}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload franchise logo. Square aspect ratio recommended.
                      Max 2MB.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Cover/Banner Image <span className="text-red-500">*</span>
                    </label>
                    <DragDropUploader
                      value={formik.values.cover_image_url}
                      onChange={(files) => {
                        formik.setFieldValue("cover_image_url", files);
                        formik.setFieldTouched("cover_image_url", true);
                      }}
                      multiple={false}
                      accept="image/*"
                      maxFiles={1}
                      enableCrop={true}
                      aspectRatio={16 / 9}
                      uploadToServer={true}
                    />
                    {formik.touched.cover_image_url &&
                      formik.errors.cover_image_url && (
                        <p className="text-xs text-red-500 mt-1">
                          {formik.errors.cover_image_url}
                        </p>
                      )}
                    <p className="text-xs text-gray-500">
                      Upload a banner image. 16:9 aspect ratio recommended. Max
                      5MB.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gallery Images <span className="text-red-500">*</span>
                    </label>
                    <DragDropUploader
                      value={formik.values.gallery_images}
                      onChange={(files) => {
                        formik.setFieldValue("gallery_images", files);
                        formik.setFieldTouched("gallery_images", true);
                      }}
                      multiple={true}
                      accept="image/*"
                      maxFiles={10}
                      enableCrop={false}
                      uploadToServer={true}
                    />
                    {formik.touched.gallery_images &&
                      formik.errors.gallery_images && (
                        <p className="text-xs text-red-500 mt-1">
                          {formik.errors.gallery_images}
                        </p>
                      )}
                    <p className="text-xs text-gray-500">
                      Upload at least 1 and up to 10 gallery images showcasing
                      the franchise. Supported formats: JPG, PNG, WEBP.
                    </p>
                  </div>
                </div>
              </AccordionSection>

              <InfoCard
                type="info"
                title="Franchise Listing Guidelines"
                description="Ensure all information is accurate and up-to-date. High-quality images and detailed financial data increase franchise interest. All fields marked with * are required."
              />

              {/* SUBMIT BUTTONS */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isCreatingFranchise || (isEditMode && isUpdatingFranchise)
                  }
                  className="btn bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isCreatingFranchise ||
                  (isEditMode && isUpdatingFranchise) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isEditMode ? (
                    <Pencil className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isEditMode ? "Update Franchise" : "List Franchise"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <ModalAction
        id="franchise-confirmation"
        theme="warning"
        variant="minimal"
        size="md"
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingValues(null);
        }}
        onConfirm={() => handleSubmit(pendingValues)}
        title={
          isEditMode ? "Confirm Franchise Update" : "Confirm Franchise Listing"
        }
        description={
          isEditMode
            ? `You are about to update "${pendingValues?.name}". Please verify all changes before submitting.`
            : `You are about to list "${pendingValues?.name}" as a new franchise. Please verify all information before submitting.`
        }
        confirmText={isEditMode ? "Confirm & Update" : "Confirm & List"}
        loading={isCreatingFranchise || isUpdatingFranchise}
      />
    </>
  );
};

export default FranchiseListingFormPage;
