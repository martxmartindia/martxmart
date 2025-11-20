import { NextRequest, NextResponse } from 'next/server';

const alertSettings = new Map();
const alertHistory = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...data } = body;

    switch (action) {
      case 'update_settings':
        return await updateAlertSettings(userId, data);
      case 'send_alert':
        return await sendAlert(userId, data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateAlertSettings(userId: string, settings: any) {
  alertSettings.set(userId, {
    scoreDropAlert: settings.scoreDropAlert || false,
    monthlyReport: settings.monthlyReport || false,
    emiReminder: settings.emiReminder || false,
    fraudAlert: settings.fraudAlert || false,
    updatedAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Alert settings updated successfully'
  });
}

async function sendAlert(userId: string, alertData: any) {
  const alert = {
    id: `alert_${Date.now()}`,
    userId,
    type: alertData.type,
    message: alertData.message,
    sentAt: new Date().toISOString(),
    status: 'sent'
  };

  const userAlerts = alertHistory.get(userId) || [];
  userAlerts.push(alert);
  alertHistory.set(userId, userAlerts);

  return NextResponse.json({
    success: true,
    alertId: alert.id
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const settings = alertSettings.get(userId) || {
    scoreDropAlert: false,
    monthlyReport: false,
    emiReminder: false,
    fraudAlert: false
  };

  return NextResponse.json({ success: true, settings });
}