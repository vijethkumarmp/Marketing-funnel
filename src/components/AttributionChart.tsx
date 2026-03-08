import { ChannelAttribution } from '@/entities';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

interface AttributionChartProps {
  attributions: ChannelAttribution[];
}

export default function AttributionChart({ attributions }: AttributionChartProps) {
  if (attributions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-paragraph text-base-white/60">No attribution data available</p>
      </div>
    );
  }

  const maxAttribution = Math.max(...attributions.map(a => a.markovAttributionValue || 0));
  const maxROI = Math.max(...attributions.map(a => a.roi || 0));

  const getBarWidth = (value: number, max: number) => {
    return Math.max((value / max) * 100, 5);
  };

  const getChannelColor = (channel: string) => {
    const colors: { [key: string]: string } = {
      'Organic': 'accent-bright-cyan',
      'Paid': 'accent-hot-pink',
      'Social': 'base-white',
      'Referral': 'accent-bright-cyan'
    };
    return colors[channel] || 'base-white';
  };

  const sortedByAttribution = [...attributions].sort((a, b) => 
    (b.markovAttributionValue || 0) - (a.markovAttributionValue || 0)
  );

  const sortedByROI = [...attributions].sort((a, b) => 
    (b.roi || 0) - (a.roi || 0)
  );

  return (
    <div className="space-y-12">
      {/* Markov Attribution Values */}
      <div>
        <h3 className="font-heading text-2xl mb-6 flex items-center gap-3">
          <Target className="text-accent-hot-pink" size={24} />
          MARKOV ATTRIBUTION VALUES
        </h3>
        <p className="font-paragraph text-sm text-base-white/60 mb-6">
          Statistical importance of each channel based on Markov Chain modeling. Higher values indicate greater impact on conversions.
        </p>
        <div className="space-y-4">
          {sortedByAttribution.map((attr, index) => {
            const color = getChannelColor(attr.channelName || '');
            const width = getBarWidth(attr.markovAttributionValue || 0, maxAttribution);

            return (
              <div key={attr._id} className="bg-base-white/5 border-2 border-base-white/10 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-xl">{attr.channelName}</span>
                    <span className={`font-paragraph text-xs px-3 py-1 bg-${color}/20 text-${color} border border-${color}`}>
                      RANK #{index + 1}
                    </span>
                  </div>
                  <span className="font-heading text-2xl text-accent-hot-pink">
                    {attr.markovAttributionValue?.toFixed(2)}
                  </span>
                </div>
                
                <div className="w-full h-3 bg-base-white/10 mb-3">
                  <div 
                    className={`h-full bg-${color}`}
                    style={{ width: `${width}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-paragraph text-xs text-base-white/60 mb-1">Removal Effect</p>
                    <p className="font-paragraph text-base-white">
                      {attr.removalEffect?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-base-white/60 mb-1">Conversion Weight</p>
                    <p className="font-paragraph text-base-white">
                      {attr.conversionWeight?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-base-white/60 mb-1">ROI</p>
                    <p className="font-paragraph text-base-white">
                      {attr.roi?.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {attr.description && (
                  <p className="font-paragraph text-xs text-base-white/60 mt-3">
                    {attr.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI Comparison */}
      <div className="pt-8 border-t-2 border-base-white/10">
        <h3 className="font-heading text-2xl mb-6 flex items-center gap-3">
          <DollarSign className="text-accent-bright-cyan" size={24} />
          ROI COMPARISON
        </h3>
        <p className="font-paragraph text-sm text-base-white/60 mb-6">
          Return on investment analysis for each marketing channel.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedByROI.map(attr => {
            const color = getChannelColor(attr.channelName || '');
            const width = getBarWidth(attr.roi || 0, maxROI);
            const isPositive = (attr.roi || 0) > 0;

            return (
              <div key={attr._id} className="bg-base-white/5 border-2 border-base-white/10 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-lg">{attr.channelName}</span>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="text-accent-bright-cyan" size={20} />
                    ) : (
                      <TrendingDown className="text-destructive" size={20} />
                    )}
                    <span className={`font-heading text-xl ${isPositive ? 'text-accent-bright-cyan' : 'text-destructive'}`}>
                      {attr.roi?.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-base-white/10">
                  <div 
                    className={`h-full ${isPositive ? `bg-${color}` : 'bg-destructive'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Removal Effect Analysis */}
      <div className="pt-8 border-t-2 border-base-white/10">
        <h3 className="font-heading text-2xl mb-6 text-accent-hot-pink">
          REMOVAL EFFECT ANALYSIS
        </h3>
        <p className="font-paragraph text-sm text-base-white/60 mb-6">
          Predicted revenue loss if each channel were removed from the marketing mix.
        </p>
        <div className="bg-accent-hot-pink/20 border-2 border-accent-hot-pink p-8">
          <div className="space-y-4">
            {sortedByAttribution.map(attr => (
              <div key={attr._id} className="flex items-center justify-between">
                <span className="font-paragraph text-sm text-base-white">
                  {attr.channelName}
                </span>
                <span className="font-heading text-lg text-accent-hot-pink">
                  -{attr.removalEffect?.toFixed(2)}% revenue impact
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-base-white/5 border-2 border-accent-bright-cyan p-8">
        <h3 className="font-heading text-2xl mb-4 text-accent-bright-cyan">KEY INSIGHTS</h3>
        <div className="space-y-3 font-paragraph text-sm text-base-white/90">
          <p>
            <span className="font-bold text-accent-hot-pink">Top Performer:</span> {sortedByAttribution[0]?.channelName} 
            shows the highest attribution value of {sortedByAttribution[0]?.markovAttributionValue?.toFixed(2)}, 
            indicating critical importance to the conversion path.
          </p>
          <p>
            <span className="font-bold text-accent-hot-pink">Highest ROI:</span> {sortedByROI[0]?.channelName} 
            delivers {sortedByROI[0]?.roi?.toFixed(1)}% return on investment, making it the most cost-effective channel.
          </p>
          <p>
            <span className="font-bold text-accent-hot-pink">Critical Dependency:</span> Removing {sortedByAttribution[0]?.channelName} 
            would result in a {sortedByAttribution[0]?.removalEffect?.toFixed(2)}% decrease in overall conversions.
          </p>
        </div>
      </div>
    </div>
  );
}
