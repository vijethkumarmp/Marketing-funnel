import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { FunnelStages } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ReportsPage() {
  const [stages, setStages] = useState<FunnelStages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStages();
  }, []);

  const loadStages = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<FunnelStages>('funnelstages');
      setStages(result.items);
    } catch (error) {
      console.error('Error loading stages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalLeakage = stages.reduce((sum, s) => sum + (s.revenueLeakageAmount || 0), 0);
    const avgConversionRate = stages.reduce((sum, s) => sum + (s.conversionRate || 0), 0) / stages.length || 0;
    const avgDropOffRate = stages.reduce((sum, s) => sum + (s.dropOffRate || 0), 0) / stages.length || 0;
    const highestFriction = stages.reduce((max, s) => 
      (s.revenueLeakageAmount || 0) > (max.revenueLeakageAmount || 0) ? s : max
    , stages[0] || {});

    return { totalLeakage, avgConversionRate, avgDropOffRate, highestFriction };
  };

  const totals = stages.length > 0 ? calculateTotals() : null;

  const getSeverityColor = (dropOffRate: number) => {
    if (dropOffRate > 40) return 'text-destructive border-destructive';
    if (dropOffRate > 25) return 'text-accent-hot-pink border-accent-hot-pink';
    return 'text-accent-bright-cyan border-accent-bright-cyan';
  };

  const getSeverityBg = (dropOffRate: number) => {
    if (dropOffRate > 40) return 'bg-destructive/20';
    if (dropOffRate > 25) return 'bg-accent-hot-pink/20';
    return 'bg-accent-bright-cyan/20';
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
              FRICTION <span className="text-accent-hot-pink">REPORT</span>
            </h1>
            <p className="font-paragraph text-lg text-base-white/70 max-w-3xl">
              Stage-by-stage conversion analysis with revenue leakage calculations and friction point identification.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <LoadingSpinner />
            </div>
          ) : stages.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-heading text-2xl text-base-white/40">NO FRICTION DATA AVAILABLE</p>
            </div>
          ) : (
            <>
              {/* Summary Metrics */}
              {totals && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                >
                  <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-destructive" size={24} />
                      <span className="font-heading text-3xl">${totals.totalLeakage.toLocaleString()}</span>
                    </div>
                    <p className="font-paragraph text-xs text-base-white/60">TOTAL REVENUE LEAKAGE</p>
                  </div>
                  <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Percent className="text-accent-bright-cyan" size={24} />
                      <span className="font-heading text-3xl">{totals.avgConversionRate.toFixed(1)}%</span>
                    </div>
                    <p className="font-paragraph text-xs text-base-white/60">AVG CONVERSION RATE</p>
                  </div>
                  <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingDown className="text-accent-hot-pink" size={24} />
                      <span className="font-heading text-3xl">{totals.avgDropOffRate.toFixed(1)}%</span>
                    </div>
                    <p className="font-paragraph text-xs text-base-white/60">AVG DROP-OFF RATE</p>
                  </div>
                  <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="text-destructive" size={24} />
                      <span className="font-heading text-xl">{totals.highestFriction.stageName}</span>
                    </div>
                    <p className="font-paragraph text-xs text-base-white/60">HIGHEST FRICTION POINT</p>
                  </div>
                </motion.div>
              )}

              {/* Critical Alert */}
              {totals && totals.highestFriction && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-destructive/20 border-2 border-destructive p-6 mb-12"
                >
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="text-destructive flex-shrink-0" size={32} />
                    <div>
                      <h3 className="font-heading text-2xl mb-2 text-destructive">CRITICAL FRICTION DETECTED</h3>
                      <p className="font-paragraph text-sm text-base-white/90 mb-2">
                        The <span className="font-bold text-destructive">{totals.highestFriction.stageName}</span> stage 
                        is experiencing the highest revenue leakage of{' '}
                        <span className="font-bold text-destructive">${totals.highestFriction.revenueLeakageAmount?.toLocaleString()}</span>.
                      </p>
                      <p className="font-paragraph text-sm text-base-white/70">
                        Drop-off rate: {totals.highestFriction.dropOffRate?.toFixed(1)}% | 
                        Conversion rate: {totals.highestFriction.conversionRate?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stages Breakdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="space-y-6"
              >
                <h2 className="font-heading text-3xl mb-6">
                  STAGE-BY-STAGE <span className="text-accent-bright-cyan">ANALYSIS</span>
                </h2>

                {stages.map((stage, index) => (
                  <motion.div
                    key={stage._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className={`bg-base-white/5 border-2 ${getSeverityColor(stage.dropOffRate || 0)} p-8`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* Stage Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="font-heading text-3xl">{stage.stageName}</h3>
                          <span className={`font-paragraph text-xs px-3 py-1 ${getSeverityBg(stage.dropOffRate || 0)} border ${getSeverityColor(stage.dropOffRate || 0)}`}>
                            {(stage.dropOffRate || 0) > 40 ? 'CRITICAL' : (stage.dropOffRate || 0) > 25 ? 'HIGH' : 'MODERATE'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="font-paragraph text-xs text-base-white/60 mb-1">CONVERSION RATE</p>
                            <p className="font-heading text-2xl text-accent-bright-cyan">
                              {stage.conversionRate?.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="font-paragraph text-xs text-base-white/60 mb-1">DROP-OFF RATE</p>
                            <p className={`font-heading text-2xl ${getSeverityColor(stage.dropOffRate || 0)}`}>
                              {stage.dropOffRate?.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="font-paragraph text-xs text-base-white/60 mb-1">REVENUE LEAKAGE</p>
                            <p className="font-heading text-2xl text-destructive">
                              ${stage.revenueLeakageAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-paragraph text-xs text-base-white/60 mb-1">SURVIVAL ESTIMATE</p>
                            <p className="font-heading text-2xl text-base-white">
                              {stage.survivalEstimate?.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="w-full h-2 bg-base-white/10">
                        <div 
                          className={`h-full ${
                            (stage.dropOffRate || 0) > 40 ? 'bg-destructive' : 
                            (stage.dropOffRate || 0) > 25 ? 'bg-accent-hot-pink' : 
                            'bg-accent-bright-cyan'
                          }`}
                          style={{ width: `${stage.dropOffRate}%` }}
                        />
                      </div>
                      <p className="font-paragraph text-xs text-base-white/60 mt-2">
                        Drop-off visualization
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-12 bg-accent-hot-pink/20 border-2 border-accent-hot-pink p-8"
              >
                <h2 className="font-heading text-3xl mb-6 text-accent-hot-pink">
                  OPTIMIZATION RECOMMENDATIONS
                </h2>
                <div className="space-y-4 font-paragraph text-sm text-base-white/90">
                  <p>
                    <span className="font-bold text-accent-hot-pink">1. Focus on High-Friction Stages:</span> Prioritize 
                    optimization efforts on stages with drop-off rates exceeding 25% to maximize ROI.
                  </p>
                  <p>
                    <span className="font-bold text-accent-hot-pink">2. Revenue Recovery:</span> A 10% improvement in the 
                    highest friction stage could recover ${((totals?.highestFriction.revenueLeakageAmount || 0) * 0.1).toLocaleString()} 
                    in annual revenue.
                  </p>
                  <p>
                    <span className="font-bold text-accent-hot-pink">3. A/B Testing:</span> Implement multivariate testing 
                    on critical conversion points to identify optimal user experience patterns.
                  </p>
                  <p>
                    <span className="font-bold text-accent-hot-pink">4. Velocity Optimization:</span> Reduce time-to-conversion 
                    by implementing automated nurture campaigns during high-friction stages.
                  </p>
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
