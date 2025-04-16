"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const Overview = () => {
  const { t } = useTranslation();

  return <div>{t("overview")}</div>;
};

export default Overview;
