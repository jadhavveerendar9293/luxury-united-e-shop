import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Website Settings — Luxury United" }] }),
  component: AdminSettingsPage,
});

type WebsiteSettings = Tables<"website_settings">;

interface SettingsForm {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  addressCountry: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  pinterestUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroCtaLink: string;
  footerNewsletter: string;
  footerAbout: string;
  primaryColor: string;
  darkModeEnabled: boolean;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableSearch: boolean;
  enableNewsletter: boolean;
  currencyCode: string;
  currencySymbol: string;
  privacyPolicy: string;
  termsConditions: string;
  refundPolicy: string;
  shippingPolicy: string;
}

function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>({
    siteName: "Luxury United",
    logoUrl: "",
    faviconUrl: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressCity: "",
    addressState: "",
    addressPostalCode: "",
    addressCountry: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    pinterestUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    heroCta: "",
    heroCtaLink: "",
    footerNewsletter: "",
    footerAbout: "",
    primaryColor: "#D4AF37",
    darkModeEnabled: true,
    enableReviews: true,
    enableWishlist: true,
    enableSearch: true,
    enableNewsletter: true,
    currencyCode: "USD",
    currencySymbol: "$",
    privacyPolicy: "",
    termsConditions: "",
    refundPolicy: "",
    shippingPolicy: "",
  });

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "contact" | "social" | "hero" | "policies" | "features" | "faq"
  >("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        const settingsData = data as Tables<"website_settings">;
        setSettings({
          siteName: settingsData.site_name || "Luxury United",
          logoUrl: settingsData.logo_url || "",
          faviconUrl: settingsData.favicon_url || "",
          contactEmail: settingsData.contact_email || "",
          contactPhone: settingsData.contact_phone || "",
          whatsappNumber: settingsData.whatsapp_number || "",
          addressLine1: settingsData.address_line1 || "",
          addressLine2: settingsData.address_line2 || "",
          addressCity: settingsData.address_city || "",
          addressState: settingsData.address_state || "",
          addressPostalCode: settingsData.address_postal_code || "",
          addressCountry: settingsData.address_country || "",
          instagramUrl: settingsData.instagram_url || "",
          facebookUrl: settingsData.facebook_url || "",
          twitterUrl: settingsData.twitter_url || "",
          pinterestUrl: settingsData.pinterest_url || "",
          linkedinUrl: settingsData.linkedin_url || "",
          youtubeUrl: settingsData.youtube_url || "",
          heroTitle: settingsData.hero_title || "",
          heroSubtitle: settingsData.hero_subtitle || "",
          heroCta: settingsData.hero_cta_text || "",
          heroCtaLink: settingsData.hero_cta_link || "",
          footerNewsletter: settingsData.footer_newsletter_title || "",
          footerAbout: settingsData.footer_about_text || "",
          primaryColor: settingsData.primary_color || "#D4AF37",
          darkModeEnabled: settingsData.enable_dark_mode ?? true,
          enableReviews: settingsData.enable_reviews ?? true,
          enableWishlist: settingsData.enable_wishlist ?? true,
          enableSearch: settingsData.enable_search ?? true,
          enableNewsletter: settingsData.enable_newsletter ?? true,
          currencyCode: settingsData.currency_code || "USD",
          currencySymbol: settingsData.currency_symbol || "$",
          privacyPolicy: settingsData.privacy_policy || "",
          termsConditions: settingsData.terms_conditions || "",
          refundPolicy: settingsData.refund_policy || "",
          shippingPolicy: settingsData.shipping_policy || "",
        });

        if (settingsData.faq_content && typeof settingsData.faq_content === "object") {
          setFaqs(settingsData.faq_content as any);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);

      const { data: existing } = await supabase
        .from("website_settings")
        .select("id")
        .single();

      const updateData = {
        site_name: settings.siteName,
        logo_url: settings.logoUrl,
        favicon_url: settings.faviconUrl,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        whatsapp_number: settings.whatsappNumber,
        address_line1: settings.addressLine1,
        address_line2: settings.addressLine2,
        address_city: settings.addressCity,
        address_state: settings.addressState,
        address_postal_code: settings.addressPostalCode,
        address_country: settings.addressCountry,
        instagram_url: settings.instagramUrl,
        facebook_url: settings.facebookUrl,
        twitter_url: settings.twitterUrl,
        pinterest_url: settings.pinterestUrl,
        linkedin_url: settings.linkedinUrl,
        youtube_url: settings.youtubeUrl,
        hero_title: settings.heroTitle,
        hero_subtitle: settings.heroSubtitle,
        hero_cta_text: settings.heroCta,
        hero_cta_link: settings.heroCtaLink,
        footer_newsletter_title: settings.footerNewsletter,
        footer_about_text: settings.footerAbout,
        primary_color: settings.primaryColor,
        enable_dark_mode: settings.darkModeEnabled,
        enable_reviews: settings.enableReviews,
        enable_wishlist: settings.enableWishlist,
        enable_search: settings.enableSearch,
        enable_newsletter: settings.enableNewsletter,
        currency_code: settings.currencyCode,
        currency_symbol: settings.currencySymbol,
        privacy_policy: settings.privacyPolicy,
        terms_conditions: settings.termsConditions,
        refund_policy: settings.refundPolicy,
        shipping_policy: settings.shippingPolicy,
        faq_content: faqs,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const existingData = existing as Tables<"website_settings">;
        const { error } = await (supabase as any)
          .from("website_settings")
          .update(updateData)
          .eq("id", existingData.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("website_settings").insert([updateData]);
        if (error) throw error;
      }

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-pearl/50">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-serif text-pearl mb-2">Website Settings</h2>
          <p className="text-pearl/50">Configure your store settings and preferences</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 bg-champagne text-obsidian px-6 py-2.5 rounded hover:bg-pearl transition-colors disabled:opacity-50 font-medium text-sm"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap border-b border-pearl/10">
        {[
          { id: "general" as const, label: "General" },
          { id: "contact" as const, label: "Contact" },
          { id: "social" as const, label: "Social Links" },
          { id: "hero" as const, label: "Hero Section" },
          { id: "policies" as const, label: "Policies" },
          { id: "features" as const, label: "Features" },
          { id: "faq" as const, label: "FAQ" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
              activeTab === tab.id
                ? "border-champagne text-champagne"
                : "border-transparent text-pearl/50 hover:text-pearl"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === "general" && (
          <div className="space-y-4">
            <h3 className="font-serif text-pearl text-lg">General Settings</h3>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={settings.logoUrl}
                onChange={(e) =>
                  setSettings({ ...settings, logoUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://..."
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Favicon URL
              </label>
              <input
                type="url"
                value={settings.faviconUrl}
                onChange={(e) =>
                  setSettings({ ...settings, faviconUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://..."
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Primary Color
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="w-20 h-10 rounded cursor-pointer border border-pearl/20"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="flex-1 bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl text-sm focus:outline-none focus:border-champagne/40"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkModeEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      darkModeEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-champagne"
                />
                <span className="text-sm text-pearl">Enable Dark Mode</span>
              </label>
            </FormGroup>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-4">
            <h3 className="font-serif text-pearl text-lg">Contact Details</h3>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, contactPhone: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <hr className="border-pearl/10" />
            <h4 className="font-medium text-pearl text-sm mt-6">Address</h4>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={settings.addressLine1}
                onChange={(e) =>
                  setSettings({ ...settings, addressLine1: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={settings.addressLine2}
                onChange={(e) =>
                  setSettings({ ...settings, addressLine2: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <div className="grid md:grid-cols-2 gap-4">
              <FormGroup>
                <label className="block text-sm font-medium text-pearl mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={settings.addressCity}
                  onChange={(e) =>
                    setSettings({ ...settings, addressCity: e.target.value })
                  }
                  className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                />
              </FormGroup>
              <FormGroup>
                <label className="block text-sm font-medium text-pearl mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={settings.addressState}
                  onChange={(e) =>
                    setSettings({ ...settings, addressState: e.target.value })
                  }
                  className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                />
              </FormGroup>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormGroup>
                <label className="block text-sm font-medium text-pearl mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={settings.addressPostalCode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      addressPostalCode: e.target.value,
                    })
                  }
                  className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                />
              </FormGroup>
              <FormGroup>
                <label className="block text-sm font-medium text-pearl mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={settings.addressCountry}
                  onChange={(e) =>
                    setSettings({ ...settings, addressCountry: e.target.value })
                  }
                  className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                />
              </FormGroup>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <h3 className="font-serif text-pearl text-lg">Social Media Links</h3>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) =>
                  setSettings({ ...settings, instagramUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://instagram.com/..."
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) =>
                  setSettings({ ...settings, facebookUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://facebook.com/..."
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={settings.twitterUrl}
                onChange={(e) =>
                  setSettings({ ...settings, twitterUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://twitter.com/..."
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Pinterest
              </label>
              <input
                type="url"
                value={settings.pinterestUrl}
                onChange={(e) =>
                  setSettings({ ...settings, pinterestUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://pinterest.com/..."
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) =>
                  setSettings({ ...settings, linkedinUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://linkedin.com/..."
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                YouTube
              </label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) =>
                  setSettings({ ...settings, youtubeUrl: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="https://youtube.com/..."
              />
            </FormGroup>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="space-y-4">
            <h3 className="font-serif text-pearl text-lg">Hero Section</h3>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Title
              </label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroTitle: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Subtitle
              </label>
              <textarea
                value={settings.heroSubtitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroSubtitle: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 min-h-24"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={settings.heroCta}
                onChange={(e) =>
                  setSettings({ ...settings, heroCta: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                CTA Button Link
              </label>
              <input
                type="text"
                value={settings.heroCtaLink}
                onChange={(e) =>
                  setSettings({ ...settings, heroCtaLink: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Footer Newsletter Title
              </label>
              <input
                type="text"
                value={settings.footerNewsletter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    footerNewsletter: e.target.value,
                  })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Footer About Text
              </label>
              <textarea
                value={settings.footerAbout}
                onChange={(e) =>
                  setSettings({ ...settings, footerAbout: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 min-h-24"
              />
            </FormGroup>
          </div>
        )}

        {activeTab === "policies" && (
          <div className="space-y-4">
            <h3 className="font-serif text-pearl text-lg">Policies</h3>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Privacy Policy
              </label>
              <textarea
                value={settings.privacyPolicy}
                onChange={(e) =>
                  setSettings({ ...settings, privacyPolicy: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 min-h-32 font-mono text-sm"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Terms and Conditions
              </label>
              <textarea
                value={settings.termsConditions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    termsConditions: e.target.value,
                  })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 min-h-32 font-mono text-sm"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Refund Policy
              </label>
              <textarea
                value={settings.refundPolicy}
                onChange={(e) =>
                  setSettings({ ...settings, refundPolicy: e.target.value })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 min-h-32 font-mono text-sm"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Shipping Policy
              </label>
              <textarea
                value={settings.shippingPolicy}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingPolicy: e.target.value,
                  })
                }
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 min-h-32 font-mono text-sm"
              />
            </FormGroup>
          </div>
        )}

        {activeTab === "features" && (
          <div className="space-y-4">
            <h3 className="font-serif text-pearl text-lg">Feature Toggles</h3>
            <FormGroup>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableReviews}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableReviews: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-champagne"
                />
                <span className="text-sm text-pearl">Enable Customer Reviews</span>
              </label>
            </FormGroup>
            <FormGroup>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableWishlist}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableWishlist: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-champagne"
                />
                <span className="text-sm text-pearl">Enable Wishlist</span>
              </label>
            </FormGroup>
            <FormGroup>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSearch}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableSearch: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-champagne"
                />
                <span className="text-sm text-pearl">Enable Product Search</span>
              </label>
            </FormGroup>
            <FormGroup>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNewsletter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableNewsletter: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-champagne"
                />
                <span className="text-sm text-pearl">Enable Newsletter</span>
              </label>
            </FormGroup>
            <hr className="border-pearl/10" />
            <h4 className="font-medium text-pearl text-sm mt-6">Currency Settings</h4>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Currency Code
              </label>
              <input
                type="text"
                value={settings.currencyCode}
                onChange={(e) =>
                  setSettings({ ...settings, currencyCode: e.target.value })
                }
                maxLength={3}
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="USD"
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-pearl mb-2">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) =>
                  setSettings({ ...settings, currencySymbol: e.target.value })
                }
                maxLength={3}
                className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40"
                placeholder="$"
              />
            </FormGroup>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-pearl text-lg">FAQ</h3>
              <button
                onClick={() =>
                  setFaqs([...faqs, { question: "", answer: "" }])
                }
                className="flex items-center gap-2 text-champagne hover:text-pearl transition-colors text-sm"
              >
                <Plus size={16} />
                Add FAQ
              </button>
            </div>

            {faqs.length === 0 ? (
              <div className="text-center py-12 bg-card/40 rounded border border-pearl/10">
                <p className="text-pearl/50 mb-4">No FAQs yet</p>
                <button
                  onClick={() =>
                    setFaqs([...faqs, { question: "", answer: "" }])
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 bg-champagne/20 text-champagne rounded hover:bg-champagne/30 transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add First FAQ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-card/40 border border-pearl/10 rounded p-4 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[idx].question = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 text-sm font-medium"
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[idx].answer = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      className="w-full bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 text-pearl focus:outline-none focus:border-champagne/40 text-sm min-h-24"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          setFaqs(faqs.filter((_, i) => i !== idx))
                        }
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}
