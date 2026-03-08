import { useMemo } from 'react';
import { UserJourneys } from '@/entities';

interface SankeyDiagramProps {
  journeys: UserJourneys[];
}

export default function SankeyDiagram({ journeys }: SankeyDiagramProps) {
  const sankeyData = useMemo(() => {
    const stages = ['Awareness', 'Interest', 'Consideration', 'Intent', 'Conversion'];
    const flows: { [key: string]: number } = {};

    journeys.forEach(journey => {
      let currentStage = 'Awareness';
      
      if (journey.awarenessTimestamp) {
        if (journey.interestTimestamp) {
          flows['Awareness→Interest'] = (flows['Awareness→Interest'] || 0) + 1;
          currentStage = 'Interest';
          
          if (journey.considerationTimestamp) {
            flows['Interest→Consideration'] = (flows['Interest→Consideration'] || 0) + 1;
            currentStage = 'Consideration';
            
            if (journey.intentTimestamp) {
              flows['Consideration→Intent'] = (flows['Consideration→Intent'] || 0) + 1;
              currentStage = 'Intent';
              
              if (journey.conversionTimestamp) {
                flows['Intent→Conversion'] = (flows['Intent→Conversion'] || 0) + 1;
                currentStage = 'Conversion';
              } else {
                flows['Intent→Drop-off'] = (flows['Intent→Drop-off'] || 0) + 1;
              }
            } else {
              flows['Consideration→Drop-off'] = (flows['Consideration→Drop-off'] || 0) + 1;
            }
          } else {
            flows['Interest→Drop-off'] = (flows['Interest→Drop-off'] || 0) + 1;
          }
        } else {
          flows['Awareness→Drop-off'] = (flows['Awareness→Drop-off'] || 0) + 1;
        }
      }
    });

    return flows;
  }, [journeys]);

  const maxFlow = Math.max(...Object.values(sankeyData));
  const total = journeys.length;

  const getFlowWidth = (count: number) => {
    return Math.max((count / maxFlow) * 100, 5);
  };

  const stageTransitions = [
    { from: 'Awareness', to: 'Interest', key: 'Awareness→Interest' },
    { from: 'Interest', to: 'Consideration', key: 'Interest→Consideration' },
    { from: 'Consideration', to: 'Intent', key: 'Consideration→Intent' },
    { from: 'Intent', to: 'Conversion', key: 'Intent→Conversion' }
  ];

  const dropoffs = [
    { stage: 'Awareness', key: 'Awareness→Drop-off' },
    { stage: 'Interest', key: 'Interest→Drop-off' },
    { stage: 'Consideration', key: 'Consideration→Drop-off' },
    { stage: 'Intent', key: 'Intent→Drop-off' }
  ];

  return (
    <div className="w-full">
      {/* Stage Headers */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {['Awareness', 'Interest', 'Consideration', 'Intent', 'Conversion'].map((stage, index) => (
          <div key={stage} className="text-center">
            <div className="font-heading text-xl mb-2 text-accent-bright-cyan">{stage}</div>
            <div className="font-paragraph text-xs text-base-white/60">
              Stage {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Flow Visualization */}
      <div className="space-y-6">
        {stageTransitions.map((transition, index) => {
          const count = sankeyData[transition.key] || 0;
          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
          const width = getFlowWidth(count);

          return (
            <div key={transition.key} className="relative">
              <div className="flex items-center gap-4">
                <div className="flex-1 text-right">
                  <span className="font-heading text-2xl text-accent-hot-pink">{count}</span>
                  <span className="font-paragraph text-sm text-base-white/60 ml-2">users</span>
                </div>
                
                <div className="flex-[3] relative">
                  <div 
                    className="h-12 bg-gradient-to-r from-accent-bright-cyan to-accent-hot-pink relative overflow-hidden"
                    style={{ width: `${width}%` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-paragraph text-xs text-base-white font-bold">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <span className="font-paragraph text-sm text-base-white/60">
                    {transition.from} → {transition.to}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Drop-offs */}
        <div className="mt-12 pt-8 border-t-2 border-base-white/10">
          <h3 className="font-heading text-2xl mb-6 text-destructive">DROP-OFF ANALYSIS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dropoffs.map(dropoff => {
              const count = sankeyData[dropoff.key] || 0;
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';

              return (
                <div key={dropoff.key} className="bg-base-white/5 border-2 border-destructive/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-paragraph text-sm text-base-white/70">{dropoff.stage}</span>
                    <span className="font-heading text-xl text-destructive">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-base-white/10">
                    <div 
                      className="h-full bg-destructive"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="font-paragraph text-xs text-base-white/60 mt-1">
                    {percentage}% drop-off rate
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-accent-bright-cyan/20 border-2 border-accent-bright-cyan p-6">
          <div className="font-heading text-3xl text-accent-bright-cyan mb-1">{total}</div>
          <div className="font-paragraph text-xs text-base-white/70">TOTAL JOURNEYS</div>
        </div>
        <div className="bg-accent-hot-pink/20 border-2 border-accent-hot-pink p-6">
          <div className="font-heading text-3xl text-accent-hot-pink mb-1">
            {sankeyData['Intent→Conversion'] || 0}
          </div>
          <div className="font-paragraph text-xs text-base-white/70">CONVERSIONS</div>
        </div>
        <div className="bg-destructive/20 border-2 border-destructive p-6">
          <div className="font-heading text-3xl text-destructive mb-1">
            {Object.keys(sankeyData)
              .filter(key => key.includes('Drop-off'))
              .reduce((sum, key) => sum + sankeyData[key], 0)}
          </div>
          <div className="font-paragraph text-xs text-base-white/70">TOTAL DROP-OFFS</div>
        </div>
      </div>
    </div>
  );
}
