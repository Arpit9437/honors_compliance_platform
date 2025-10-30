import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div className="flex flex-col"> 
          <h1 className="text-4xl font font-semibold text-center my-7">
            About PolicySync
          </h1>
          <div className="text-xl text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to <b>PolicySync</b> — a platform built to simplify how professionals,
              businesses, and individuals stay updated with India’s ever-evolving
              <b> regulatory landscape</b>.
            </p>

            <p>
              This platform was originally developed as a full-stack project using
              <b> JavaScript, React, Node.js, Express.js,</b> and <b>MongoDB</b>. It has now evolved
              into a smart compliance tool that helps users access and understand
              regulatory changes across domains like <b>Taxation, Labour Laws, Finance,
              Corporate Compliance,</b> and <b>Government Schemes</b>.
            </p>

            <p>
              Only verified administrators manage and publish compliance updates,
              while users can read, bookmark, and interact with them. Users can
              easily sign in using <b>Google OAuth</b>, manage their profiles, and
              personalize their experience on the platform.
            </p>

            <p>
              At <b>PolicySync</b>, we aim to create a collaborative community of compliance
              professionals, entrepreneurs, and learners who can share knowledge
              and stay informed — together.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
