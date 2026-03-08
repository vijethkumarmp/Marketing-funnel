/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: channelattribution
 * Interface for ChannelAttribution
 */
export interface ChannelAttribution {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  channelName?: string;
  /** @wixFieldType number */
  markovAttributionValue?: number;
  /** @wixFieldType number */
  removalEffect?: number;
  /** @wixFieldType number */
  roi?: number;
  /** @wixFieldType number */
  conversionWeight?: number;
  /** @wixFieldType text */
  description?: string;
}


/**
 * Collection ID: funnelstages
 * Interface for FunnelStages
 */
export interface FunnelStages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  stageName?: string;
  /** @wixFieldType number */
  conversionRate?: number;
  /** @wixFieldType number */
  revenueLeakageAmount?: number;
  /** @wixFieldType number */
  dropOffRate?: number;
  /** @wixFieldType number */
  survivalEstimate?: number;
}


/**
 * Collection ID: userjourneys
 * Interface for UserJourneys
 */
export interface UserJourneys {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  journeyId?: string;
  /** @wixFieldType text */
  channel?: string;
  /** @wixFieldType datetime */
  awarenessTimestamp?: Date | string;
  /** @wixFieldType datetime */
  interestTimestamp?: Date | string;
  /** @wixFieldType datetime */
  considerationTimestamp?: Date | string;
  /** @wixFieldType datetime */
  intentTimestamp?: Date | string;
  /** @wixFieldType datetime */
  conversionTimestamp?: Date | string;
  /** @wixFieldType number */
  funnelVelocity?: number;
  /** @wixFieldType number */
  propensityScore?: number;
  /** @wixFieldType number */
  revenueValue?: number;
}
