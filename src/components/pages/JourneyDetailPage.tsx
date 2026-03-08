import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, TrendingUp, DollarSign, CheckCircle, Circle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { UserJourneys } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function JourneyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [journey, setJourney] = useState<UserJourneys | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJourney();
  }, [id]);

  const loadJourney = async () => {
    try {
      setIsLoading(true);
      const data = await BaseCrudService.getById<UserJourneys>('userjourneys', id!);
      setJourney(data);
    } catch (error) {
      console.error('Error loading journey:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp?: Date | string) => {
    if (!timestamp) return 'Not reached';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  const stages = [
    {
      name: 'Awareness',
      description: 'Ad Click',
      timestamp: journey?.awarenessTimestamp,
      icon: Circle
    },
    {
      name: 'Interest',
      description: 'Blog Visit',
      timestamp: journey?.interestTimestamp,
      icon: Circle
    },
    {
      name: 'Consideration',
      description: 'Pricing Page',
      timestamp: journey?.considerationTimestamp,
      icon: Circle
    },
    {
      name: 'Intent',
      description: 'Form Fill',
      timestamp: journey?.intentTimestamp,
      icon: Circle
    },
    {
      name: 'Conversion',
      description: 'Purchase',
      timestamp: journey?.conversionTimestamp,
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-base-black text-base-white">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-[120rem] mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <LoadingSpinner />
            </div>
          ) : !journey ? (
            <div className="text-center py-32">
              <h1 className="font-heading text-4xl mb-4">JOURNEY NOT FOUND</h1>
              <Link to="/dashboard" className="text-accent-bright-cyan hover:text-accent-hot-pink transition-colors">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 text-accent-bright-cyan hover:text-accent-hot-pink transition-colors font-paragraph"
                >
                  <ArrowLeft size={20} />
                  BACK TO DASHBOARD
                </Link>
              </motion.div>

              {/* Journey Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div>
                    <h1 className="font-heading text-5xl md:text-6xl mb-4">
                      JOURNEY <span className="text-accent-hot-pink">{journey.journeyId}</span>
                    </h1>
                    <div className="flex flex-wrap gap-4">
                      <span className="font-paragraph text-sm px-4 py-2 bg-accent-bright-cyan/20 text-accent-bright-cyan border border-accent-bright-cyan">
                        {journey.channel}
                      </span>
                      {journey.conversionTimestamp && (
                        <span className="font-paragraph text-sm px-4 py-2 bg-accent-hot-pink/20 text-accent-hot-pink border border-accent-hot-pink">
                          CONVERTED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="text-accent-bright-cyan" size={24} />
                      <span className="font-heading text-3xl">{journey.funnelVelocity?.toFixed(1)}h</span>
                    </div>
                    <p className="font-paragraph text-xs text-base-white/60">FUNNEL VELOCITY</p>
                  </div>
                  <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-accent-hot-pink" size={24} />
                      <span className="font-heading text-3xl">{journey.propensityScore?.toFixed(1)}%</span>
                    </div>
                    <p className="font-paragraph text-xs text-base-white/60">PROPENSITY SCORE</p>
                  </div>
                  <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-base-white" size={24} />
                      <span className="font-heading text-3xl">${journey.revenueValue || 0}</span>
                    </div>
                    <p className="font-paragraph text-xs text-base-white/60">REVENUE VALUE</p>
                  </div>
                </div>
              </motion.div>

              {/* Journey Timeline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-base-white/5 border-2 border-base-white/10 p-8 md:p-12"
              >
                <h2 className="font-heading text-3xl mb-8">
                  FUNNEL <span className="text-accent-bright-cyan">PROGRESSION</span>
                </h2>

                <div className="space-y-6">
                  {stages.map((stage, index) => {
                    const isCompleted = !!stage.timestamp;
                    const Icon = stage.icon;
                    
                    return (
                      <motion.div
                        key={stage.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className="flex items-start gap-6">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 border-2 flex items-center justify-center ${
                            isCompleted 
                              ? 'border-accent-hot-pink bg-accent-hot-pink/20' 
                              : 'border-base-white/20 bg-base-white/5'
                          }`}>
                            <Icon 
                              size={24} 
                              className={isCompleted ? 'text-accent-hot-pink' : 'text-base-white/40'} 
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <h3 className={`font-heading text-2xl ${
                                isCompleted ? 'text-base-white' : 'text-base-white/40'
                              }`}>
                                {stage.name}
                              </h3>
                              <span className={`font-paragraph text-sm ${
                                isCompleted ? 'text-accent-bright-cyan' : 'text-base-white/40'
                              }`}>
                                {formatTimestamp(stage.timestamp)}
                              </span>
                            </div>
                            <p className={`font-paragraph text-sm ${
                              isCompleted ? 'text-base-white/70' : 'text-base-white/40'
                            }`}>
                              {stage.description}
                            </p>
                          </div>
                        </div>

                        {/* Connector Line */}
                        {index < stages.length - 1 && (
                          <div className={`absolute left-6 top-12 w-0.5 h-6 ${
                            stages[index + 1].timestamp ? 'bg-accent-hot-pink' : 'bg-base-white/20'
                          }`} />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Additional Insights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="bg-base-white/5 border-2 border-base-white/10 p-8">
                  <h3 className="font-heading text-2xl mb-4 text-accent-bright-cyan">CHANNEL ANALYSIS</h3>
                  <p className="font-paragraph text-sm text-base-white/70 mb-4">
                    This journey originated from <span className="text-accent-hot-pink font-bold">{journey.channel}</span> channel.
                  </p>
                  <p className="font-paragraph text-sm text-base-white/70">
                    {journey.conversionTimestamp 
                      ? 'This channel successfully converted this user, contributing to the overall attribution model.'
                      : 'This journey has not yet converted. Continue monitoring for conversion signals.'}
                  </p>
                </div>

                <div className="bg-base-white/5 border-2 border-base-white/10 p-8">
                  <h3 className="font-heading text-2xl mb-4 text-accent-bright-cyan">VELOCITY INSIGHTS</h3>
                  <p className="font-paragraph text-sm text-base-white/70 mb-4">
                    Funnel velocity of <span className="text-accent-hot-pink font-bold">{journey.funnelVelocity?.toFixed(1)} hours</span> indicates 
                    {(journey.funnelVelocity || 0) < 24 
                      ? ' rapid progression through the funnel.'
                      : ' slower progression requiring nurture campaigns.'}
                  </p>
                  <p className="font-paragraph text-sm text-base-white/70">
                    Propensity score of <span className="text-accent-hot-pink font-bold">{journey.propensityScore?.toFixed(1)}%</span> suggests 
                    {(journey.propensityScore || 0) > 70 
                      ? ' high likelihood of conversion.'
                      : ' moderate conversion probability.'}
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
