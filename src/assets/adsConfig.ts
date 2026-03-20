export const UNITY_ADS_CONFIG = {
  APP_ID: 'ca-app-pub-3087035459476299~9045025850',
  AD_UNIT_ID: 'ca-app-pub-3087035459476299/8295751666',
  IS_TEST_MODE: true,
};

export const AD_PLACEMENT_TYPES = {
  REWARDED: 'Rewarded_Android', // Standard Unity naming
  INTERSTITIAL: 'Interstitial_Android',
  BANNER: 'Banner_Android',
};

export class AdsManager {
  static showRewardedAd(onComplete: () => void) {
    console.log(`[AdsManager] Showing Rewarded Ad: ${UNITY_ADS_CONFIG.AD_UNIT_ID}`);
    // Simulated Ad delay
    setTimeout(() => {
      console.log("[AdsManager] Ad Completed!");
      onComplete();
    }, 1500);
  }

  static showInterstitialAd() {
    console.log(`[AdsManager] Showing Interstitial Ad: ${UNITY_ADS_CONFIG.AD_UNIT_ID}`);
  }
}
