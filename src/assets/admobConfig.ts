// Google AdMob Configuration

// Extend Window interface for our callback
declare global {
  interface Window {
    rewardedAdCallback?: (success: boolean) => void;
  }
}

export const ADMOB_CONFIG = {
  // Test Ad Unit IDs (use these for development)
  TEST_AD_UNIT_IDS: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  },
  
  // Your Production Ad Unit IDs (replace with your actual AdMob IDs)
  PRODUCTION_AD_UNIT_IDS: {
    BANNER: 'ca-app-pub-3087035459476299/4404608111',
    INTERSTITIAL: 'ca-app-pub-3087035459476299/4404608111', 
    REWARDED: 'ca-app-pub-3087035459476299/4404608111',
  },
  
  // AdMob App ID (replace with your actual AdMob App ID)
  APP_ID: 'ca-app-pub-3087035459476299~9045025850',
  
  // Use test ads during development
  USE_TEST_ADS: false,
  
  // Ad settings
  AD_SETTINGS: {
    BANNER_REFRESH_RATE: 30000, // 30 seconds
    INTERSTITIAL_FREQUENCY: 3, // Show every 3 games
    REWARDED_COIN_BONUS: 50, // Coins rewarded for watching ad
  }
}

// Get current ad unit IDs based on environment
export const getAdUnitIds = () => {
  return ADMOB_CONFIG.USE_TEST_ADS 
    ? ADMOB_CONFIG.TEST_AD_UNIT_IDS 
    : ADMOB_CONFIG.PRODUCTION_AD_UNIT_IDS;
}

// AdMob Ads Manager Class
export class AdMobAdsManager {
  private static instance: AdMobAdsManager;
  private isInitialized = false;
  private gamesPlayed = 0;

  static getInstance(): AdMobAdsManager {
    if (!AdMobAdsManager.instance) {
      AdMobAdsManager.instance = new AdMobAdsManager();
    }
    return AdMobAdsManager.instance;
  }

  // Initialize AdMob
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // In a real implementation, you would initialize AdMob here
      // For web demo, we'll simulate the initialization
      console.log('AdMob initialized with App ID:', ADMOB_CONFIG.APP_ID);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  // Show Banner Ad
  async showBannerAd(containerId: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Simulated banner ad display
      console.log('Showing banner ad in container:', containerId);
      this.createBannerElement(containerId);
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  }

  // Show Interstitial Ad
  async showInterstitialAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Check if it's time to show interstitial
    this.gamesPlayed++;
    if (this.gamesPlayed < ADMOB_CONFIG.AD_SETTINGS.INTERSTITIAL_FREQUENCY) {
      return false;
    }

    try {
      console.log('Showing interstitial ad');
      this.gamesPlayed = 0; // Reset counter
      
      // Simulated interstitial
      this.showInterstitialModal();
      return true;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  // Show Rewarded Ad
  async showRewardedAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Showing rewarded ad');
      
      // Simulated rewarded ad
      const success = await this.showRewardedModal();
      if (success) {
        // Award coins for watching ad
        const currentCoins = parseInt(localStorage.getItem('coins') || '0');
        const newCoins = currentCoins + ADMOB_CONFIG.AD_SETTINGS.REWARDED_COIN_BONUS;
        localStorage.setItem('coins', newCoins.toString());
        
        // Trigger UI update
        window.dispatchEvent(new CustomEvent('coinsUpdated', { 
          detail: { coins: newCoins, bonus: ADMOB_CONFIG.AD_SETTINGS.REWARDED_COIN_BONUS }
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return false;
    }
  }

  // Create banner ad element
  private createBannerElement(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Remove existing banner
    const existingBanner = container.querySelector('.admob-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    // Create banner element
    const banner = document.createElement('div');
    banner.className = 'admob-banner';
    banner.innerHTML = `
      <div class="bg-yellow-400 text-black px-4 py-2 text-center text-sm font-semibold rounded">
        📱 AdMob Banner Ad (Test)
      </div>
    `;
    
    container.appendChild(banner);
  }

  // Show interstitial modal
  private showInterstitialModal(): void {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <div class="text-center">
          <div class="text-4xl mb-4">📱</div>
          <h3 class="text-lg font-bold mb-2">AdMob Interstitial Ad</h3>
          <p class="text-gray-600 mb-4">This is a test interstitial ad. In production, this would show a real ad.</p>
          <button onclick="this.closest('.fixed').remove()" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Close Ad
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 3000);
  }

  // Show rewarded ad modal
  private showRewardedModal(): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
          <div class="text-center">
            <div class="text-4xl mb-4">🎁</div>
            <h3 class="text-lg font-bold mb-2">Watch Ad for ${ADMOB_CONFIG.AD_SETTINGS.REWARDED_COIN_BONUS} Coins!</h3>
            <p class="text-gray-600 mb-4">Watch this short ad to earn bonus coins.</p>
            <div class="flex gap-2 justify-center">
              <button onclick="this.closest('.fixed').remove(); window.rewardedAdCallback(false)" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                Skip
              </button>
              <button onclick="this.closest('.fixed').remove(); window.rewardedAdCallback(true)" class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                Watch & Earn
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Set callback
      window.rewardedAdCallback = (success: boolean) => {
        delete window.rewardedAdCallback;
        resolve(success);
      };
    });
  }

  // Hide banner ad
  hideBannerAd(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const banner = container.querySelector('.admob-banner');
    if (banner) {
      banner.remove();
    }
  }
}

// Export singleton instance
export const adsManager = AdMobAdsManager.getInstance();
