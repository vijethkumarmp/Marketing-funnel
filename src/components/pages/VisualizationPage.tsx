import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { UserJourneys, ChannelAttribution } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import SankeyDiagram from '@/components/SankeyDiagram';
import AttributionChart from '@/components/AttributionChart';

export default function VisualizationPage() {
  const [journeys, setJourneys] = useState<UserJourneys[]>([]);
  const [attributions, setAttributions] = useState<ChannelAttribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [journeysResult, attributionsResult] = await Promise.all([
        BaseCrudService.getAll<UserJourneys>('userjourneys', {}, { limit: 1000 }),
        BaseCrudService.getAll<ChannelAttribution>('channelattribution')
      ]);
      
      setJourneys(journeysResult.items);
      setAttributions(attributionsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-black text-base-white">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <h1 className="font-heading text-6xl md:text-7xl mb-4">
              FLOW <span className="text-accent-hot-pink">VISUALIZATION</span>
            </h1>
            <p className="font-paragraph text-lg text-base-white/70 max-w-3xl">
              Interactive Sankey diagrams and Markov Chain attribution analysis for data-driven insights.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Sankey Diagram */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-12"
              >
                <div className="bg-base-white/5 border-2 border-base-white/10 p-8">
                  <h2 className="font-heading text-3xl mb-6">
                    SANKEY <span className="text-accent-bright-cyan">FLOW DIAGRAM</span>
                  </h2>
                  <p className="font-paragraph text-sm text-base-white/60 mb-8">
                    Visualizing user progression through funnel stages and identifying drop-off points.
                  </p>
                  <SankeyDiagram journeys={journeys} />
                </div>
              </motion.div>

              {/* Attribution Analysis */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="bg-base-white/5 border-2 border-base-white/10 p-8">
                  <h2 className="font-heading text-3xl mb-6">
                    MARKOV CHAIN <span className="text-accent-bright-cyan">ATTRIBUTION</span>
                  </h2>
                  <p className="font-paragraph text-sm text-base-white/60 mb-8">
                    Channel importance analysis with removal effect calculations and ROI metrics.
                  </p>
                  <AttributionChart attributions={attributions} />
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
