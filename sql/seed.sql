insert into public.listings (id, user_id, title, description, price, category, campus, condition, status)
select gen_random_uuid(), p.id, 'Bureau étudiant compact', 'Bureau parfait pour une chambre étudiante, démontable et propre.', 45, 'Mobilier', 'Paris', 'Bon état', 'active'
from public.profiles p
limit 1
on conflict do nothing;

insert into public.listings (id, user_id, title, description, price, category, campus, condition, status)
select gen_random_uuid(), p.id, 'Cours de mathématiques', 'Étudiant en école d’ingé donne des cours de soutien le soir.', 20, 'Cours', 'Lyon', 'Très bon état', 'active'
from public.profiles p
offset 1 limit 1
on conflict do nothing;
