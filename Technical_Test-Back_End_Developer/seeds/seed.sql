INSERT INTO users (nama, email) VALUES
    ('Budi Hartono', 'budi@example.com'),
    ('Sinta Dewi', 'sinta@example.com'),
    ('Rizki Pratama', 'rizki@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO transactions (user_id, type, amount, gram, created_at) VALUES
    (1, 'BUY', 500000, 0.257000, NOW() - INTERVAL '7 days'),
    (1, 'BUY', 1000000, 0.514000, NOW() - INTERVAL '5 days'),
    (1, 'SELL', 380000, 0.195400, NOW() - INTERVAL '3 days'),
    (2, 'BUY', 2000000, 1.028000, NOW() - INTERVAL '10 days'),
    (2, 'BUY', 500000, 0.257000, NOW() - INTERVAL '2 days'),
    (3, 'BUY', 750000, 0.385500, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;
