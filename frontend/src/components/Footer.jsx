import React from "react";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";

const FooterCom = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/Arpit9437/honors_compliance_platform", color: "hover:text-gray-900 dark:hover:text-white" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-500" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">

        </div>


      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} PolicySync. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-200 hover:scale-110`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Made with love */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Made with ❤️ by Team PolicySync | Shri Ramdeobaba College of Engineering & Management
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCom;
