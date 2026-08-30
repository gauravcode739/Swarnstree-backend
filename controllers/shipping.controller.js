import Shipping from '../models/Shipping.js';
import Setting from '../models/Setting.js';

// --- Global Settings ---
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { globalFreeShippingThreshold } = req.body;
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }
    settings.globalFreeShippingThreshold = globalFreeShippingThreshold;
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Shipping State Controls ---
export const getStates = async (req, res) => {
  try {
    const states = await Shipping.find();
    res.status(200).json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStateConfig = async (req, res) => {
  try {
    const { isoCode } = req.params;
    const { stateName, isActive, cost, cityOverrides } = req.body;

    let stateConfig = await Shipping.findOne({ stateIsoCode: isoCode });
    if (!stateConfig) {
      stateConfig = new Shipping({ stateIsoCode: isoCode, stateName });
    }

    if (isActive !== undefined) stateConfig.isActive = isActive;
    if (cost !== undefined) stateConfig.cost = cost;
    if (cityOverrides !== undefined) stateConfig.cityOverrides = cityOverrides;

    await stateConfig.save();
    res.status(200).json({ success: true, data: stateConfig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Calculate Endpoint ---
export const calculateShipping = async (req, res) => {
  try {
    const { state, stateIsoCode, city, cartTotal } = req.body;
    console.log('calculateShipping payload:', req.body);
    
    if (!stateIsoCode) {
      return res.status(400).json({ success: false, message: 'State ISO Code is required' });
    }

    // 1. Check Global Free Shipping Threshold
    const settings = await Setting.findOne();
    const threshold = settings?.globalFreeShippingThreshold || 0;
    const total = Number(cartTotal) || 0;
    
    if (threshold > 0 && total >= threshold) {
      return res.status(200).json({ success: true, shippingCost: 0, appliedRuleId: 'global_free' });
    }

    // 2. Find State Config
    const stateConfig = await Shipping.findOne({ stateIsoCode });
    
    // If state config doesn't exist, block shipping since default is inactive
    if (!stateConfig) {
       return res.status(400).json({ success: false, message: 'Shipping is not available for this state (unconfigured).' });
    }

    if (!stateConfig.isActive) {
       return res.status(400).json({ success: false, message: 'Shipping is not available for this state.' });
    }

    let finalCost = stateConfig.cost;

    // 3. Check City Override
    if (city) {
      const cityOverride = stateConfig.cityOverrides.find(c => c.cityName.toLowerCase() === city.toLowerCase());
      if (cityOverride) {
        if (!cityOverride.isActive) {
          return res.status(400).json({ success: false, message: 'Shipping is not available for this city.' });
        }
        if (cityOverride.cost !== null && cityOverride.cost !== undefined) {
          finalCost = cityOverride.cost;
        }
      } else {
        return res.status(400).json({ success: false, message: 'Shipping is not available for this city (unconfigured).' });
      }
    }

    return res.status(200).json({ success: true, shippingCost: finalCost, appliedRuleId: 'state_city_config' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
