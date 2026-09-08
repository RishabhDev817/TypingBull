import React from 'react';
import { motion } from 'framer-motion';
import { ProductRoadmap } from '../components/ProductRoadmap';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { useI18n } from '../context/I18nContext';
import { usePageSEO } from '../hooks/usePageSEO';

export const RoadmapPage: React.FC = () => {
  const { currentLang } = useI18n();
  usePageSEO(currentLang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8 justify-between"
    >
      <div className="w-full max-w-6xl mx-auto my-auto">
        <ProductRoadmap />
      </div>

      <div className="mt-14 max-w-6xl mx-auto w-full">
        <SiteFooter />
      </div>
    </motion.div>
  );
};

export default RoadmapPage;
