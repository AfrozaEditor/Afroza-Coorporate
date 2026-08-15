import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaGithub, FaTiktok, FaWhatsapp } from "react-icons/fa";

interface SocialIconProps {
  id: string;
  size?: number;
}

export function SocialIcon({ id, size = 18 }: SocialIconProps) {
  switch (id) {
    case "facebook":
      return <FaFacebookF size={size} />;
    case "twitter":
      return <FaTwitter size={size} />;
    case "youtube":
      return <FaYoutube size={size} />;
    case "linkedin":
      return <FaLinkedinIn size={size} />;
    case "instagram":
      return <FaInstagram size={size} />;
    case "github":
      return <FaGithub size={size} />;
    case "tiktok":
      return <FaTiktok size={size} />;
    case "whatsapp":
      return <FaWhatsapp size={size} />;
    default:
      return null;
  }
}