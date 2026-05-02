export const inviteTemplate = (inviterName: string, inviteLink: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h1>You have been invited</h1>

    <p>${inviterName} invited you to join the platform.</p>

    <a
      href="${inviteLink}"
      style="
        display: inline-block;
        padding: 12px 20px;
        background: black;
        color: white;
        text-decoration: none;
        border-radius: 6px;
      "
    >
      Accept Invite
    </a>

    <p>This invite expires in 24 hours.</p>
  </div>
`;
