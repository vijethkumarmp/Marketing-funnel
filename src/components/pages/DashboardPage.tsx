import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { UserJourneys } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const [journeys, setJourneys] = useState<UserJourneys[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<UserJourneys[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const LIMIT = 50;

  useEffect(() => {
    loadJourneys();
  }, [skip]);

  const loadJourneys = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<UserJourneys>('userjourneys', {}, { limit: LIMIT, skip });
      
      if (skip === 0) {
        setJourneys(result.items);
        setFilteredJourneys(result.items);
      } else {
        setJourneys(prev => [...prev, ...result.items]);
        setFilteredJourneys(prev => [...prev, ...result.items]);
      }
      
      setHasNext(result.hasNext);
    } catch (error) {
      console.error('Error loading journeys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = journeys;

    if (searchTerm) {
      filtered = filtered.filter(j => 
        j.journeyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.channel?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedChannel !== 'all') {
      filtered = filtered.filter(j => j.channel === selectedChannel);
    }

    if (selectedStage !== 'all') {
      filtered = filtered.filter(j => {
        if (selectedStage === 'converted') return !!j.conversionTimestamp;
        if (selectedStage === 'intent') return !!j.intentTimestamp && !j.conversionTimestamp;
        if (selectedStage === 'consideration') return !!j.considerationTimestamp && !j.intentTimestamp;
        if (selectedStage === 'interest') return !!j.interestTimestamp && !j.considerationTimestamp;
        if (selectedStage === 'awareness') return !!j.awarenessTimestamp && !j.interestTimestamp;
        return true;
      });
    }

    setFilteredJourneys(filtered);
  }, [searchTerm, selectedChannel, selectedStage, journeys]);

  const channels = ['all', 'Organic', 'Paid', 'Social', 'Referral'];
  const stages = ['all', 'awareness', 'interest', 'consideration', 'intent', 'converted'];

  const calculateMetrics = () => {
    const total = journeys.length;
    const converted = journeys.filter(j => j.conversionTimestamp).length;
    const conversionRate = total > 0 ? (converted / total * 100).toFixed(1) : '0';
    const avgVelocity = journeys.reduce((sum, j) => sum + (j.funnelVelocity || 0), 0) / total || 0;
    const avgPropensity = journeys.reduce((sum, j) => sum + (j.propensityScore || 0), 0) / total || 0;
    const totalRevenue = journeys.reduce((sum, j) => sum + (j.revenueValue || 0), 0);

    return { total, converted, conversionRate, avgVelocity, avgPropensity, totalRevenue };
  };

  const metrics = calculateMetrics();

  const getStageLabel = (journey: UserJourneys) => {
    if (journey.conversionTimestamp) return 'Converted';
    if (journey.intentTimestamp) return 'Intent';
    if (journey.considerationTimestamp) return 'Consideration';
    if (journey.interestTimestamp) return 'Interest';
    if (journey.awarenessTimestamp) return 'Awareness';
    return 'Unknown';
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Converted': return 'text-accent-bright-cyan';
      case 'Intent': return 'text-accent-hot-pink';
      case 'Consideration': return 'text-base-white';
      case 'Interest': return 'text-base-white/70';
      case 'Awareness': return 'text-base-white/50';
      default: return 'text-base-white/30';
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
              JOURNEY <span className="text-accent-hot-pink">DASHBOARD</span>
            </h1>
            <p className="font-paragraph text-lg text-base-white/70 max-w-3xl">
              Real-time analytics of user journeys across all funnel stages with velocity and propensity scoring.
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          >
            <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
              <div className="font-heading text-3xl text-accent-bright-cyan mb-1">{metrics.total}</div>
              <div className="font-paragraph text-xs text-base-white/60">TOTAL JOURNEYS</div>
            </div>
            <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
              <div className="font-heading text-3xl text-accent-hot-pink mb-1">{metrics.converted}</div>
              <div className="font-paragraph text-xs text-base-white/60">CONVERSIONS</div>
            </div>
            <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
              <div className="font-heading text-3xl text-base-white mb-1">{metrics.conversionRate}%</div>
              <div className="font-paragraph text-xs text-base-white/60">CONV. RATE</div>
            </div>
            <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
              <div className="font-heading text-3xl text-accent-bright-cyan mb-1">{metrics.avgVelocity.toFixed(1)}h</div>
              <div className="font-paragraph text-xs text-base-white/60">AVG VELOCITY</div>
            </div>
            <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
              <div className="font-heading text-3xl text-accent-hot-pink mb-1">{metrics.avgPropensity.toFixed(1)}%</div>
              <div className="font-paragraph text-xs text-base-white/60">AVG PROPENSITY</div>
            </div>
            <div className="bg-base-white/5 border-2 border-base-white/10 p-6">
              <div className="font-heading text-3xl text-base-white mb-1">${metrics.totalRevenue.toLocaleString()}</div>
              <div className="font-paragraph text-xs text-base-white/60">TOTAL REVENUE</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-base-white/5 border-2 border-base-white/10 p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-white/40" size={20} />
                <input
                  type="text"
                  placeholder="SEARCH BY JOURNEY ID OR CHANNEL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-base-black border-2 border-base-white/20 pl-12 pr-4 py-3 font-paragraph text-sm text-base-white placeholder:text-base-white/40 focus:border-accent-hot-pink focus:outline-none"
                />
              </div>

              {/* Channel Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-white/40" size={20} />
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full lg:w-48 bg-base-black border-2 border-base-white/20 pl-12 pr-4 py-3 font-paragraph text-sm text-base-white focus:border-accent-bright-cyan focus:outline-none appearance-none cursor-pointer"
                >
                  {channels.map(channel => (
                    <option key={channel} value={channel}>
                      {channel.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full lg:w-48 bg-base-black border-2 border-base-white/20 px-4 py-3 font-paragraph text-sm text-base-white focus:border-accent-bright-cyan focus:outline-none appearance-none cursor-pointer"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>
                      {stage.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Journeys List */}
          <div className="min-h-[600px]">
            {isLoading && skip === 0 ? (
              <div className="flex items-center justify-center py-32">
                <LoadingSpinner />
              </div>
            ) : filteredJourneys.length === 0 ? (
              <div className="text-center py-32">
                <p className="font-heading text-2xl text-base-white/40">NO JOURNEYS FOUND</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredJourneys.map((journey, index) => (
                  <motion.div
                    key={journey._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <Link
                      to={`/journey/${journey._id}`}
                      className="block bg-base-white/5 border-2 border-base-white/10 p-6 hover:border-accent-hot-pink transition-all group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-heading text-xl group-hover:text-accent-hot-pink transition-colors">
                              {journey.journeyId}
                            </h3>
                            <span className="font-paragraph text-xs px-3 py-1 bg-accent-bright-cyan/20 text-accent-bright-cyan border border-accent-bright-cyan">
                              {journey.channel}
                            </span>
                            <span className={`font-paragraph text-xs px-3 py-1 border ${getStageColor(getStageLabel(journey))}`}>
                              {getStageLabel(journey)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-accent-bright-cyan" />
                            <span className="font-paragraph text-sm">
                              {journey.funnelVelocity?.toFixed(1)}h
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-accent-hot-pink" />
                            <span className="font-paragraph text-sm">
                              {journey.propensityScore?.toFixed(1)}%
                            </span>
                          </div>
                          {journey.revenueValue && journey.revenueValue > 0 && (
                            <div className="flex items-center gap-2">
                              <DollarSign size={16} className="text-base-white" />
                              <span className="font-paragraph text-sm">
                                ${journey.revenueValue}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Load More */}
          {hasNext && !isLoading && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setSkip(prev => prev + LIMIT)}
                className="bg-accent-bright-cyan text-base-black px-8 py-4 font-heading text-sm uppercase hover:bg-accent-bright-cyan/90 transition-colors"
              >
                LOAD MORE JOURNEYS
              </button>
            </div>
          )}

          {isLoading && skip > 0 && (
            <div className="mt-8 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
